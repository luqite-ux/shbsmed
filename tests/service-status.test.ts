import assert from "node:assert/strict"
import test from "node:test"

import { isWebsiteServiceAvailable } from "../lib/service-status.ts"

test("service status fails open within a bounded request window", async () => {
  const originalFetch = globalThis.fetch
  const originalTenant = process.env.NEXT_PUBLIC_TENANT_ID
  const originalAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL

  process.env.NEXT_PUBLIC_TENANT_ID = "tenant-under-test"
  process.env.NEXT_PUBLIC_ADMIN_URL = "https://admin.example.com"
  globalThis.fetch = ((_input: URL | RequestInfo, init?: RequestInit) =>
    new Promise<Response>((_resolve, reject) => {
      init?.signal?.addEventListener("abort", () => reject(init.signal?.reason), { once: true })
    })) as typeof fetch

  const startedAt = performance.now()
  try {
    assert.equal(await isWebsiteServiceAvailable(), true)
    assert.ok(performance.now() - startedAt < 3_500, "service-status fallback exceeded 3.5 seconds")
  } finally {
    globalThis.fetch = originalFetch
    process.env.NEXT_PUBLIC_TENANT_ID = originalTenant
    process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl
  }
})

test("service status honors a valid expired response that arrives after normal network latency", async () => {
  const originalFetch = globalThis.fetch
  const originalTenant = process.env.NEXT_PUBLIC_TENANT_ID
  const originalAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL

  process.env.NEXT_PUBLIC_TENANT_ID = "tenant-under-test"
  process.env.NEXT_PUBLIC_ADMIN_URL = "https://admin.example.com"
  globalThis.fetch = ((_input: URL | RequestInfo, init?: RequestInit) =>
    new Promise<Response>((resolve, reject) => {
      const timer = setTimeout(
        () => resolve(Response.json({ version: 1, available: false, status: "expired" })),
        800,
      )
      init?.signal?.addEventListener("abort", () => {
        clearTimeout(timer)
        reject(init.signal?.reason)
      }, { once: true })
    })) as typeof fetch

  try {
    assert.equal(await isWebsiteServiceAvailable(), false)
  } finally {
    globalThis.fetch = originalFetch
    process.env.NEXT_PUBLIC_TENANT_ID = originalTenant
    process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl
  }
})
