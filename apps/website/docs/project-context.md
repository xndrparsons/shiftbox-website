# Shiftbox Website Context (handover summary)

- Monorepo with `apps/website` (Next.js 15, Tailwind, shadcn).
- Supabase schema: `vehicles` core + `vehicle_statuses`, `dvla_ves_data`, `dvla_mot_*`.
- RLS on tables; public access via SECURITY DEFINER RPCs:
  - `list_public_sales(...)` for catalogue
  - `get_public_vehicle(uuid)` for details
- Website now renders homepage list and details using those RPCs.
- Goal: ship MVP storefront ASAP:
  - Home (hero + featured), Vehicles list (filters), Vehicle detail (specs + DVLA VES + CTAs),
  - Services/About, Contact form → `contact_messages`.
- Post-MVP: Admin dashboard, DVLA/MOT ingest actions, Work Orders v0, image gallery, SEO polish.
