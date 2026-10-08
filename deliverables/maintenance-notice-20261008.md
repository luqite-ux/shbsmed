# shbsmed.com temporary website notice

- Workbench task: `cc0f53e4-cb68-42e2-9e24-8ee7d908bf00` (`scope=global`).
- Requested public message: the website is being updated; expected return on October 15, 2026; business contact `info@shbsmed.com`.
- Public routes temporarily rewrite to `/maintenance`. Administration, APIs, static files, `robots.txt`, and `sitemap.xml` remain on their own routes.
- The old site source and content remain in this repository. This change does not schedule an automatic return to the old site.
- To restore the public site after the customer approves it, remove the maintenance rewrite in `proxy.ts`, restore the former `app/robots.ts` and `app/sitemap.ts`, then deploy and verify the formal domain on desktop and mobile.
- Local validation: the notice rendered on desktop and 390px mobile without horizontal overflow; the business email is a working `mailto:` link. The home, product list, product detail, contact and news routes returned the notice; `/admin/login` remained separate. `robots.txt` disallows crawling and the sitemap contains no old URLs.
