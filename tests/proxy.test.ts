import assert from "node:assert/strict"
import test from "node:test"

import { NextRequest } from "next/server.js"
import { proxy } from "../proxy.ts"

test("proxy allows a public product request when service status configuration is absent", async () => {
  const originalTenant = process.env.NEXT_PUBLIC_TENANT_ID
  const originalAdminUrl = process.env.NEXT_PUBLIC_ADMIN_URL
  delete process.env.NEXT_PUBLIC_TENANT_ID
  delete process.env.NEXT_PUBLIC_ADMIN_URL

  try {
    const response = await proxy(new NextRequest("https://shbsmed.com/products"))
    assert.equal(response.headers.get("x-middleware-next"), "1")
  } finally {
    process.env.NEXT_PUBLIC_TENANT_ID = originalTenant
    process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl
  }
})
