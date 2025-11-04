# Cost Calculator (Business Quote Manager)

A small React + TypeScript component for creating and saving professional quotes. This workspace contains a single component `cost_calculator.tsx` and a minimal Vite scaffold to run it locally.

## What I changed

- Added TypeScript types to the component and typed React state.
- Added small storage helpers that prefer `window.storage` (if your host provides a storage API) and fall back to `localStorage` in the browser.
- Replaced direct `window.storage` calls with the safer helpers.
- Added a minimal Vite + React TypeScript scaffolding (`package.json`, `tsconfig.json`, `index.html`, `src/main.tsx`) so you can run the app locally.

## Quick start (Windows PowerShell)

1. Install dependencies:

```powershell
npm install
```

2. Run the dev server:

```powershell
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

## Notes

- The component uses `lucide-react` for icons. The `package.json` includes it as a dependency.
- Storage behavior:
  - If a host provides a `window.storage.get` / `window.storage.set` API, the app will use that.
  - Otherwise it will fall back to browser `localStorage`.

## Next steps / suggestions

- Install and configure Tailwind CSS if you want the utility classes to be processed (the component uses Tailwind class names). Without Tailwind the styles will not render as intended.
- Add a small CSS file or a Tailwind build step for styling.
- (Optional) Move `cost_calculator.tsx` into `src/` and rename to `CostCalculator.tsx` for a more conventional layout.

If you'd like, I can:
- Add Tailwind + basic CSS so the UI looks as intended.
- Move the component into `src/` and tidy imports.
- Create a small unit test for a core helper (storage or price calculation).

