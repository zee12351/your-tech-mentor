

# Fix Build Errors, Navigation, and UI Cleanup

## 1. Add Missing Button Variants

Add `hero`, `heroOutline` variants and `xl` size to `src/components/ui/button.tsx`:
- `hero`: coral/orange gradient CTA button
- `heroOutline`: outlined version for secondary CTAs
- `xl`: larger size (`h-14 px-10 text-lg`)

## 2. Fix TypeScript Type Errors

**Interview.tsx** (lines 91, 143, 228): Cast `role` from Supabase `string` to the `Message['role']` union type using `as` assertion when reading from the database.

**InterviewReport.tsx** (line 70): Cast `skill_ratings` and `improvement_plan` from Supabase `Json` type to the local interface types (`Record<string, number>` and `string[]`).

## 3. Remove "Watch Demo" Button

In `HeroSection.tsx`, remove the "Watch Demo" `<Button>` (lines 61-64) from the CTA section.

## 4. Fix Footer Links - Create Placeholder Pages

Create 5 simple placeholder pages and add routes:
- `/about` - About Us
- `/careers` - Careers
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/refund` - Refund Policy

Each page will have a consistent layout with a back-to-home link, page title, and placeholder content.

Update `Footer.tsx`:
- Change all `<a href="#">` tags to `<Link to="/...">` for proper routing
- Remove any blob/dead links

Update `App.tsx` with the 5 new routes.

## 5. Fix Navbar Anchor Links

Convert `<a href="#features">` etc. in `Navbar.tsx` to proper scroll-to-section behavior using `<button>` elements with `document.getElementById().scrollIntoView()`, so they work correctly within the SPA.

## 6. Auth Session Redirect Logic

Auth is already wired up via `useAuth()`. Add redirect logic:
- In `Login.tsx` and `Signup.tsx`: if user is already logged in, redirect to `/dashboard`
- In `Dashboard.tsx`: already redirects to `/login` if not authenticated (confirmed)

## 7. Deployment Readiness

- Ensure all interactive elements use `<button>` or `<Link>` (not dead `<a>` tags)
- The footer `<a>` tags will be converted to `<Link>` components

---

### Technical Summary

| File | Changes |
|------|---------|
| `src/components/ui/button.tsx` | Add `hero`, `heroOutline` variants + `xl` size |
| `src/pages/Interview.tsx` | Cast `role` field with `as Message['role']` |
| `src/pages/InterviewReport.tsx` | Cast `skill_ratings` and `improvement_plan` from Json |
| `src/components/landing/HeroSection.tsx` | Remove Watch Demo button |
| `src/components/landing/Footer.tsx` | Convert `<a>` to `<Link>`, fix hrefs |
| `src/components/landing/Navbar.tsx` | Convert anchor `<a>` to scroll buttons |
| `src/pages/Login.tsx` | Add redirect if already logged in |
| `src/pages/Signup.tsx` | Add redirect if already logged in |
| `src/pages/About.tsx` | New placeholder page |
| `src/pages/Careers.tsx` | New placeholder page |
| `src/pages/Privacy.tsx` | New placeholder page |
| `src/pages/Terms.tsx` | New placeholder page |
| `src/pages/Refund.tsx` | New placeholder page |
| `src/App.tsx` | Add 5 new routes |

**Note:** The user mentioned connecting to a different Supabase project URL. This project already runs on Lovable Cloud, which provides the same backend capabilities. The existing auth setup will work as-is -- no reconfiguration needed.

