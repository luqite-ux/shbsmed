import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ISSUE_ID = 'DATA-MATERIAL-FACT-COVERAGE'
const VALID_PHASES = new Set(['intake', 'terminal'])
const VALID_SOURCE_DECISIONS = new Set(['extract', 'duplicate', 'reference_only', 'excluded_by_rule', 'unreadable'])
const VALID_UNIT_DECISIONS = new Set(['fact', 'duplicate', 'reference_only', 'excluded_by_rule'])
const VALID_FACT_DECISIONS = new Set(['use', 'duplicate', 'reference_only', 'excluded_by_rule'])
const OFFICE_CONTAINER_EXTENSIONS = new Set(['.xlsx', '.docx', '.pptx'])
const OFFICE_MEDIA_PREFIXES = ['xl/media/', 'word/media/', 'ppt/media/']
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tif', '.tiff', '.svg', '.avif', '.heic'])
const VALID_MEDIA_EXCLUSION_CODES = new Set([
  'exact_duplicate',
  'customer_marked_reference',
  'privacy_sensitive',
  'legal_or_policy_prohibited',
  'corrupt_unreadable',
])

function text(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort()
}

function isAuditOnlyLocator(value) {
  return /(?:^|\/)(?:media-library|asset-audit|all-customer-media)(?:\/|#|$)/i.test(text(value))
}

function normalizedPath(value) {
  const raw = text(value)
  if (!raw) return ''
  if (/^https?:\/\//i.test(raw)) return raw.toLowerCase()
  const resolved = path.resolve(raw).replaceAll('\\', '/')
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

function hasReason(value) {
  return Boolean(text(value))
}

export function reconcileMaterialFactCoverage(manifest, { phase = 'terminal', discoveredPaths = [], discoveredEmbeddedMedia = [] } = {}) {
  if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) throw new TypeError('manifest must be an object')
  if (!VALID_PHASES.has(phase)) throw new TypeError(`phase must be one of: ${[...VALID_PHASES].join(', ')}`)

  const sources = Array.isArray(manifest.sources) ? manifest.sources : []
  const facts = Array.isArray(manifest.facts) ? manifest.facts : []
  const registeredLocalPaths = new Set()
  const sourceIds = new Set()
  const unitRefs = new Set()
  const unitToFactIds = new Map()
  const invalidSourceIds = []
  const unreadableSourceIds = []
  const invalidUnitIds = []
  const sourceIdByPath = new Map()
  const registeredEmbeddedMedia = new Set()
  const invalidEmbeddedMediaIds = []
  const missingEmbeddedMediaDestinationIds = []
  const missingDocumentMediaScanSourceIds = []
  const missingStandaloneMediaManifestIds = []
  const invalidStandaloneMediaIds = []
  const missingStandaloneMediaDestinationIds = []
  let registeredEmbeddedMediaCount = 0
  let registeredStandaloneMediaCount = 0

  for (const [sourceIndex, rawSource] of sources.entries()) {
    const source = rawSource && typeof rawSource === 'object' ? rawSource : {}
    const sourceId = text(source.source_id) || `source-${sourceIndex + 1}`
    const sourcePath = normalizedPath(source.path)
    const decision = text(source.decision)
    let valid = Boolean(text(source.source_id) && sourcePath && text(source.type) && text(source.fingerprint))
      && VALID_SOURCE_DECISIONS.has(decision)
      && !sourceIds.has(sourceId)
    sourceIds.add(sourceId)
    if (sourcePath && !/^https?:\/\//i.test(sourcePath)) registeredLocalPaths.add(sourcePath)
    if (sourcePath) sourceIdByPath.set(sourcePath, sourceId)

    if (decision === 'extract') {
      const units = Array.isArray(source.units) ? source.units : []
      if (!text(source.extraction_evidence) || (!units.length && !hasReason(source.no_fact_reason))) valid = false
      const seenUnitIds = new Set()
      for (const [unitIndex, rawUnit] of units.entries()) {
        const unit = rawUnit && typeof rawUnit === 'object' ? rawUnit : {}
        const unitId = text(unit.unit_id) || `unit-${unitIndex + 1}`
        const unitDecision = text(unit.decision)
        const ref = `${sourceId}:${unitId}`
        let unitValid = Boolean(text(unit.unit_id) && text(unit.locator))
          && VALID_UNIT_DECISIONS.has(unitDecision)
          && !seenUnitIds.has(unitId)
        seenUnitIds.add(unitId)
        unitRefs.add(ref)
        if (unitDecision === 'fact') {
          const factIds = unique(Array.isArray(unit.fact_ids) ? unit.fact_ids.map(text) : [])
          unitToFactIds.set(ref, factIds)
          if (!factIds.length) unitValid = false
        } else if (!hasReason(unit.reason)) {
          unitValid = false
        }
        if (!unitValid) invalidUnitIds.push(ref)
      }
    } else if (!hasReason(source.reason)) {
      valid = false
    }
    if (decision === 'unreadable') unreadableSourceIds.push(sourceId)

    if (IMAGE_EXTENSIONS.has(path.extname(sourcePath).toLowerCase())) {
      const media = source.media_asset && typeof source.media_asset === 'object' ? source.media_asset : null
      if (!media) {
        valid = false
        missingStandaloneMediaManifestIds.push(sourceId)
      } else {
        const mediaDecision = text(media.decision)
        let mediaValid = Boolean(
          text(media.media_id)
          && text(media.locator)
          && text(media.fingerprint)
          && VALID_FACT_DECISIONS.has(mediaDecision)
        )
        registeredStandaloneMediaCount += 1
        if (mediaDecision === 'use') {
          const destinations = unique(Array.isArray(media.expected_destinations) ? media.expected_destinations.map(text) : [])
          if (!destinations.length || !text(media.semantic_destination) || !text(media.business_entity) || !hasReason(media.placement_reason)) mediaValid = false
          if (phase === 'terminal') {
            const targets = Array.isArray(media.terminal_targets) ? media.terminal_targets : []
            for (const layer of destinations) {
              const target = targets.find((candidate) => text(candidate?.layer) === layer)
              if (!target || !text(target.locator) || isAuditOnlyLocator(target.locator) || !text(target.evidence) || target.verification_result !== 'PASS' || text(target.asset_hash) !== text(media.fingerprint)) {
                missingStandaloneMediaDestinationIds.push(`${sourceId}:${text(media.media_id) || 'media'}:${layer}`)
              }
            }
          }
        } else {
          const reasonCode = text(media.reason_code)
          if (!VALID_MEDIA_EXCLUSION_CODES.has(reasonCode) || !hasReason(media.reason) || !text(media.evidence)) mediaValid = false
          if (reasonCode === 'exact_duplicate' && !text(media.duplicate_of)) mediaValid = false
        }
        if (!mediaValid) invalidStandaloneMediaIds.push(`${sourceId}:${text(media.media_id) || 'media'}`)
      }
    }

    const discoveredForSource = discoveredEmbeddedMedia.filter((item) => normalizedPath(item?.sourcePath) === sourcePath)
    const isDocumentContainer = OFFICE_CONTAINER_EXTENSIONS.has(path.extname(sourcePath).toLowerCase()) || path.extname(sourcePath).toLowerCase() === '.pdf'
    if (isDocumentContainer) {
      const scan = source.container_media_scan && typeof source.container_media_scan === 'object' ? source.container_media_scan : {}
      const mediaItems = Array.isArray(scan.embedded_media) ? scan.embedded_media : []
      if (scan.result !== 'PASS' || !text(scan.evidence) || !Array.isArray(scan.embedded_media)) {
        valid = false
        missingDocumentMediaScanSourceIds.push(sourceId)
      }
      const seenMediaIds = new Set()
      const seenContainerPaths = new Set()
      for (const [mediaIndex, rawMedia] of mediaItems.entries()) {
        const media = rawMedia && typeof rawMedia === 'object' ? rawMedia : {}
        const mediaId = text(media.media_id) || `media-${mediaIndex + 1}`
        const containerPath = text(media.container_path).replaceAll('\\', '/').toLowerCase()
        const mediaDecision = text(media.decision)
        const mediaRef = `${sourceId}:${mediaId}`
        let mediaValid = Boolean(
          text(media.media_id)
          && containerPath
          && text(media.locator)
          && text(media.fingerprint)
          && VALID_FACT_DECISIONS.has(mediaDecision)
          && !seenMediaIds.has(mediaId)
          && !seenContainerPaths.has(containerPath)
        )
        seenMediaIds.add(mediaId)
        seenContainerPaths.add(containerPath)
        if (containerPath) registeredEmbeddedMedia.add(`${sourceId}:${containerPath}`)
        registeredEmbeddedMediaCount += 1

        if (mediaDecision === 'use') {
          const destinations = unique(Array.isArray(media.expected_destinations) ? media.expected_destinations.map(text) : [])
          if (!text(media.extracted_path) || !text(media.extraction_evidence) || !destinations.length || !text(media.semantic_destination) || !text(media.business_entity) || !hasReason(media.placement_reason)) mediaValid = false
          if (phase === 'terminal') {
            const targets = Array.isArray(media.terminal_targets) ? media.terminal_targets : []
            for (const layer of destinations) {
              const target = targets.find((candidate) => text(candidate?.layer) === layer)
              if (!target || !text(target.locator) || isAuditOnlyLocator(target.locator) || !text(target.evidence) || target.verification_result !== 'PASS' || text(target.asset_hash) !== text(media.fingerprint)) {
                missingEmbeddedMediaDestinationIds.push(`${mediaRef}:${layer}`)
              }
            }
          }
        } else {
          const reasonCode = text(media.reason_code)
          if (!VALID_MEDIA_EXCLUSION_CODES.has(reasonCode) || !hasReason(media.reason) || !text(media.evidence)) mediaValid = false
          if (reasonCode === 'exact_duplicate' && !text(media.duplicate_of)) mediaValid = false
        }
        if (!mediaValid) invalidEmbeddedMediaIds.push(mediaRef)
      }
    }
    if (!valid) invalidSourceIds.push(sourceId)
  }

  const discovered = unique(discoveredPaths.map(normalizedPath))
  const unregisteredSourcePaths = discovered.filter((candidate) => !registeredLocalPaths.has(candidate))
  const discoveredEmbeddedMediaRefs = unique(discoveredEmbeddedMedia.map((item) => {
    const sourcePath = normalizedPath(item?.sourcePath)
    const sourceId = sourceIdByPath.get(sourcePath) || sourcePath
    const containerPath = text(item?.containerPath).replaceAll('\\', '/').toLowerCase()
    return sourceId && containerPath ? `${sourceId}:${containerPath}` : ''
  }))
  const unregisteredEmbeddedMedia = discoveredEmbeddedMediaRefs.filter((ref) => !registeredEmbeddedMedia.has(ref))
  const factIds = new Set()
  const factRefs = new Map()
  const factById = new Map()
  const invalidFactIds = []

  for (const [factIndex, rawFact] of facts.entries()) {
    const fact = rawFact && typeof rawFact === 'object' ? rawFact : {}
    const factId = text(fact.fact_id) || `fact-${factIndex + 1}`
    const decision = text(fact.decision)
    const refs = Array.isArray(fact.source_refs) ? fact.source_refs : []
    const normalizedRefs = refs.map((ref) => `${text(ref?.source_id)}:${text(ref?.unit_id)}`)
    let valid = Boolean(
      text(fact.fact_id)
      && text(fact.entity_type)
      && text(fact.entity_key)
      && text(fact.field)
      && VALID_FACT_DECISIONS.has(decision)
      && refs.length
      && normalizedRefs.every((ref) => unitRefs.has(ref))
      && !factIds.has(factId)
    )
    factIds.add(factId)
    factRefs.set(factId, new Set(normalizedRefs))
    factById.set(factId, fact)

    if (decision === 'use') {
      const destinations = unique(Array.isArray(fact.expected_destinations) ? fact.expected_destinations.map(text) : [])
      if (!text(fact.source_value_hash) || !destinations.length) valid = false
    } else if (!hasReason(fact.reason)) {
      valid = false
    }
    if (!valid) invalidFactIds.push(factId)
  }

  const unaccountedUnitIds = []
  for (const [unitRef, expectedFactIds] of unitToFactIds.entries()) {
    const linked = expectedFactIds.length > 0 && expectedFactIds.every((factId) => factIds.has(factId) && factRefs.get(factId)?.has(unitRef))
    if (!linked) unaccountedUnitIds.push(unitRef)
  }

  const unaccountedFactIds = []
  for (const [factId, refs] of factRefs.entries()) {
    const linkedBack = [...refs].every((ref) => unitToFactIds.get(ref)?.includes(factId))
    if (!linkedBack) unaccountedFactIds.push(factId)
  }

  const missingDestinationFactIds = []
  const invalidTargetFactIds = []
  const valueMismatchFactIds = []
  let verifiedDestinationCount = 0

  if (phase === 'terminal') {
    for (const [factId, fact] of factById.entries()) {
      if (text(fact.decision) !== 'use') continue
      const destinations = unique(Array.isArray(fact.expected_destinations) ? fact.expected_destinations.map(text) : [])
      const targets = Array.isArray(fact.terminal_targets) ? fact.terminal_targets : []
      for (const layer of destinations) {
        const target = targets.find((candidate) => text(candidate?.layer) === layer)
        if (!target) {
          missingDestinationFactIds.push(`${factId}:${layer}`)
          continue
        }
        const mode = text(target.verification_mode) || 'exact'
        const baseValid = Boolean(text(target.locator) && text(target.evidence) && target.verification_result === 'PASS')
        if (!baseValid || !['exact', 'faithful'].includes(mode) || (mode === 'faithful' && !text(target.semantic_evidence))) {
          invalidTargetFactIds.push(`${factId}:${layer}`)
          continue
        }
        if (mode === 'exact' && text(target.value_hash) !== text(fact.source_value_hash)) {
          valueMismatchFactIds.push(`${factId}:${layer}`)
          continue
        }
        verifiedDestinationCount += 1
      }
    }
  }

  const problems = [
    ...unregisteredSourcePaths,
    ...unregisteredEmbeddedMedia,
    ...missingDocumentMediaScanSourceIds,
    ...missingStandaloneMediaManifestIds,
    ...invalidStandaloneMediaIds,
    ...invalidSourceIds,
    ...unreadableSourceIds,
    ...invalidUnitIds,
    ...invalidFactIds,
    ...unaccountedUnitIds,
    ...unaccountedFactIds,
    ...(phase === 'terminal' ? missingDestinationFactIds : []),
    ...(phase === 'terminal' ? invalidTargetFactIds : []),
    ...(phase === 'terminal' ? valueMismatchFactIds : []),
    ...(phase === 'terminal' ? missingEmbeddedMediaDestinationIds : []),
    ...(phase === 'terminal' ? missingStandaloneMediaDestinationIds : []),
  ]

  return {
    issue_id: ISSUE_ID,
    media_issue_id: 'DATA-ALL-CUSTOMER-MEDIA-COVERAGE',
    phase,
    pass: problems.length === 0,
    unregistered_source_paths: unique(unregisteredSourcePaths),
    unregistered_embedded_media: unique(unregisteredEmbeddedMedia),
    missing_document_media_scan_source_ids: unique(missingDocumentMediaScanSourceIds),
    missing_standalone_media_manifest_ids: unique(missingStandaloneMediaManifestIds),
    invalid_standalone_media_ids: unique(invalidStandaloneMediaIds),
    invalid_source_ids: unique(invalidSourceIds),
    invalid_embedded_media_ids: unique(invalidEmbeddedMediaIds),
    unreadable_source_ids: unique(unreadableSourceIds),
    invalid_unit_ids: unique(invalidUnitIds),
    invalid_fact_ids: unique(invalidFactIds),
    unaccounted_unit_ids: unique(unaccountedUnitIds),
    unaccounted_fact_ids: unique(unaccountedFactIds),
    missing_destination_fact_ids: unique(missingDestinationFactIds),
    invalid_target_fact_ids: unique(invalidTargetFactIds),
    value_mismatch_fact_ids: unique(valueMismatchFactIds),
    missing_embedded_media_destination_ids: unique(missingEmbeddedMediaDestinationIds),
    missing_standalone_media_destination_ids: unique(missingStandaloneMediaDestinationIds),
    counts: {
      discovered_file_count: discovered.length,
      registered_source_count: sources.length,
      extraction_unit_count: unitRefs.size,
      fact_count: facts.length,
      verified_destination_count: verifiedDestinationCount,
      discovered_embedded_media_count: discoveredEmbeddedMediaRefs.length,
      registered_embedded_media_count: registeredEmbeddedMediaCount,
      discovered_standalone_media_count: discovered.filter((candidate) => IMAGE_EXTENSIONS.has(path.extname(candidate).toLowerCase())).length,
      registered_standalone_media_count: registeredStandaloneMediaCount,
    },
  }
}

function listZipEntries(buffer) {
  const eocdSignature = 0x06054b50
  const centralSignature = 0x02014b50
  const lowerBound = Math.max(0, buffer.length - 65_557)
  let eocdOffset = -1
  for (let offset = buffer.length - 22; offset >= lowerBound; offset -= 1) {
    if (buffer.readUInt32LE(offset) === eocdSignature) {
      eocdOffset = offset
      break
    }
  }
  if (eocdOffset < 0) throw new Error('Office container is not a readable ZIP archive')
  const entryCount = buffer.readUInt16LE(eocdOffset + 10)
  let offset = buffer.readUInt32LE(eocdOffset + 16)
  const entries = []
  for (let index = 0; index < entryCount; index += 1) {
    if (offset + 46 > buffer.length || buffer.readUInt32LE(offset) !== centralSignature) throw new Error('Office container central directory is invalid')
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const nameStart = offset + 46
    const nameEnd = nameStart + nameLength
    entries.push(buffer.subarray(nameStart, nameEnd).toString('utf8').replaceAll('\\', '/'))
    offset = nameEnd + extraLength + commentLength
  }
  return entries
}

export async function discoverDocumentEmbeddedMedia(paths) {
  const media = []
  for (const filePath of unique(paths.map((candidate) => path.resolve(candidate)))) {
    if (path.basename(filePath).startsWith('~$')) continue
    const extension = path.extname(filePath).toLowerCase()
    if (OFFICE_CONTAINER_EXTENSIONS.has(extension)) {
      const entries = listZipEntries(await readFile(filePath))
      for (const containerPath of entries) {
        const normalized = containerPath.toLowerCase()
        if (OFFICE_MEDIA_PREFIXES.some((prefix) => normalized.startsWith(prefix)) && !normalized.endsWith('/')) {
          media.push({ sourcePath: filePath, containerPath })
        }
      }
      continue
    }
    if (extension === '.pdf') {
      const raw = (await readFile(filePath)).toString('latin1')
      const imageCount = [...raw.matchAll(/\/Subtype\s*\/Image\b/g)].length
      const pageCount = [...raw.matchAll(/\/Type\s*\/Page\b/g)].length
      for (let index = 1; index <= imageCount; index += 1) media.push({ sourcePath: filePath, containerPath: `pdf/image-object:${index}` })
      for (let index = 1; index <= pageCount; index += 1) media.push({ sourcePath: filePath, containerPath: `pdf/page:${index}` })
      if (pageCount === 0) media.push({ sourcePath: filePath, containerPath: 'pdf/full-document-visual-scan' })
    }
  }
  return media
}

async function discoverFiles(root) {
  const files = []
  async function walk(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const candidate = path.join(directory, entry.name)
      if (entry.isDirectory()) await walk(candidate)
      else if (entry.isFile()) files.push(candidate)
    }
  }
  await walk(path.resolve(root))
  return files
}

function parseArgs(argv) {
  const args = { phase: 'terminal' }
  for (let index = 0; index < argv.length; index += 1) {
    const name = argv[index]
    if (!['--manifest', '--out', '--phase'].includes(name) || !argv[index + 1]) throw new Error(`Unknown or incomplete argument: ${name}`)
    args[name.slice(2)] = argv[index + 1]
    index += 1
  }
  if (!args.manifest) throw new Error('Usage: material-fact-coverage.mjs --manifest <file> [--phase intake|terminal] [--out <file>]')
  return args
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  const manifest = JSON.parse(await readFile(path.resolve(args.manifest), 'utf8'))
  const roots = Array.isArray(manifest.material_roots) ? manifest.material_roots.filter((root) => text(root)) : []
  const discoveredPaths = (await Promise.all(roots.map(discoverFiles))).flat()
  const discoveredEmbeddedMedia = await discoverDocumentEmbeddedMedia(discoveredPaths)
  const report = reconcileMaterialFactCoverage(manifest, { phase: args.phase, discoveredPaths, discoveredEmbeddedMedia })
  if (args.out) {
    const outputPath = path.resolve(args.out)
    await mkdir(path.dirname(outputPath), { recursive: true })
    await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8')
  }
  process.stdout.write(`${JSON.stringify({ issue_id: report.issue_id, phase: report.phase, pass: report.pass, counts: report.counts })}\n`)
  process.exitCode = report.pass ? 0 : 2
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url))) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`)
    process.exitCode = 1
  })
}
