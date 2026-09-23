import assert from "node:assert/strict"
import test from "node:test"

import { isWebsiteServiceAvailable } from "../lib/service-status.ts"

test("service status fails open before routing middleware exceeds its execution budget", async () => {
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
    assert.ok(performance.now() - startedAt < 750, "service-status fallback exceeded 750 ms")
  } finally {
    globalThis.fetch = originalFetch
    process.env.NEXT_PUBLIC_TENANT_ID = originalTenant
    process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl
  }
})
