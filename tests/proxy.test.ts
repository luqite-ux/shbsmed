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
    assert.equal(new URL(response.headers.get("x-middleware-rewrite")!).pathname, "/maintenance")
    assert.equal(response.headers.get("x-robots-tag"), "noindex, nofollow")
  } finally {
    process.env.NEXT_PUBLIC_TENANT_ID = originalTenant
    process.env.NEXT_PUBLIC_ADMIN_URL = originalAdminUrl
  }
})

test("proxy sends all public pages to the maintenance notice but preserves administration and site resources", async () => {
  for (const path of ["/", "/products", "/products/re2750-bm", "/news", "/contact", "/service-expired"]) {
    const response = await proxy(new NextRequest(`https://shbsmed.com${path}`))
    assert.equal(new URL(response.headers.get("x-middleware-rewrite")!).pathname, "/maintenance", path)
  }

  for (const path of ["/maintenance", "/admin/login", "/api/captcha", "/robots.txt", "/sitemap.xml", "/favicon.svg"]) {
    const response = await proxy(new NextRequest(`https://shbsmed.com${path}`))
    assert.equal(response.headers.get("x-middleware-rewrite"), null, path)
  }
})
