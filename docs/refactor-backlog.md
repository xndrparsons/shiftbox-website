
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

