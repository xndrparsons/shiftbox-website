
## 🔧 Shiftbox Refactor / Cleanup Backlog
1. **Vehicle detail page utils**  
   - ✅ Current: `formatPrice`, `formatMileage`, `getConditionColor`, `getConditionIcon` are inline.  
   - 📌 Later: extract into `lib/utils.ts` (or `/lib/formatters.ts`) for reuse across listings, invoices, etc.  

2. **Supabase queries**  
   - ✅ Current: using an RPC for slug detail, but other pages may still use raw `from("vehicles")`.  
   - 📌 Later: audit all pages → switch to RPCs/views for consistency and RLS safety.  

3. **Types**  
   - ✅ Current: vehicle shape is implicit from Supabase; TS interfaces are ad-hoc.  
   - 📌 Later: auto-generate types from the DB (`supabase gen types typescript --local`) and replace manual interfaces.  

4. **Metadata & SEO**  
   - ✅ Current: added `generateMetadata` to vehicle detail only.  
   - 📌 Later: add to homepage, blog posts, services pages → unify SEO strategy (titles, OG images, descriptions).  

5. **Image handling**  
   - ✅ Current: fallback placeholder string `/placeholder.svg?...`.  
   - 📌 Later: centralise a `<VehicleImage />` component with proper blurDataURL, fallback, and Cloudinary/Supabase Storage integration.  

6. **Condition + DVLA sections**  
   - ✅ Current: inline JSX with repeated patterns.  
   - 📌 Later: refactor into smaller components (`<VehicleCondition />`, `<VehicleDVLAInfo />`) for readability and reuse.  

7. **Global structure**  
   - ✅ Current: shells (`(site)` + `(admin)`) in place.  
   - 📌 Later: add `sitemap.ts`, `robots.txt`, and filterable listings (faceted search).  


## 🔧 Shiftbox Refactor / Cleanup Backlog (after shells & slug work)
- Extract formatting helpers from vehicle detail page into /lib/utils.
- Audit other pages to use RPCs/views instead of raw table reads.
- Generate Supabase TS types into @shiftbox/db and replace ad-hoc interfaces.
- Add generateMetadata to homepage, services, blog for consistent SEO.
- Centralise <VehicleImage/> with blur/fallback + storage integration.
- Split DVLA/Condition sections into components for reuse.
- Add sitemap.ts and robots.ts to website.
- Convert any remaining pages to (site) shell and wire real Header/Footer.
- Tighten website (admin) middleware once auth is in place.

## SEO & Robots (staging safeguards added)
- [x] Add robots.ts to block non-prod and allow prod; disallow /(admin) and /api in prod.
- [x] Add X-Robots-Tag noindex,nofollow header via middleware on non-prod (defense in depth).
- [ ] Build dynamic sitemap.ts from Supabase (vehicles slugs, services, blog).
- [ ] Add schema.org/Vehicle JSON-LD on vehicle detail pages.
- [ ] Add dynamic OG images for vehicles (optional).
- [ ] Review canonical URLs before launch.


## Vehicles listing filters
- [x] Add VehicleFilters UI with debounced model search and price slider.
- [x] Wire searchParams → RPC on server page; clean query params.
- [ ] Extend list_public_sales RPC to accept make/model/fuel/trans/price params and return total count for pagination.
- [ ] Replace inline card with <VehicleCard/> and add skeleton/empty states.
- [ ] Add pagination component using total count and page size.


## Roles hardening
- [x] Temporary: treat any authenticated session as admin for website (admin) access.
- [ ] Add `public.user_profiles` with role enum and RLS.
- [ ] Update Header + middleware to use roles: owner/admin only see admin/app links.
- [ ] Add server action to promote/demote roles (owner only).

## Middleware hygiene
- [x] Merge website non-prod noindex and (admin) session-protect into one middleware.
- [ ] When roles land, update website middleware to require role ∈ {owner,admin} for /(admin) routes.
