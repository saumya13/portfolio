# Experiments section (archived)

Taken out of the app but kept here. Files:

- `Experiments.tsx`  -> `src/sections/Experiments.tsx` (also has the optional dot-grid backdrop)
- `experiments.ts`   -> `src/content/experiments.ts`
- `PlusGrid.tsx`     -> `src/components/PlusGrid.tsx` (used by an earlier version of the section)

To bring it back:

1. Move the three files back to the paths above.
2. In `src/pages/Home.tsx`, import `Experiments` and render `<Experiments />` after `<Work />`.
3. In `src/content/site.ts`, add `{ label: "Experiments", href: "/#experiments", cta: false }` to `nav` (before About).

The `.marquee` styles used by one of its tiles are still in `src/index.css`.
