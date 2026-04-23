# PRISM-GRID Frontend

PRISM-GRID is a production-oriented frontend foundation for an AI-powered project intelligence platform focused on predicting delays, surfacing cost drift, coordinating interventions, and improving decision-making for large-scale infrastructure programs.

This phase is intentionally centered on the product surface:

- A premium landing experience aligned to the PRISM-GRID brief
- A production-style app shell with route-level code splitting
- A command center dashboard for predictive risk and executive control
- Portfolio, alerts, vendor, simulation, reporting, and workspace modules
- A calmer, more professional design system with responsive layouts
- Stronger repository polish for continued API and backend integration

## Product Direction

The current UI is organized around the operating model described in the PRISM-GRID brief:

- Data ingestion and risk intelligence
- Explainable recommendations and intervention workflows
- Vendor scoring and oversight
- Scenario simulation for mitigation planning
- Compliance visibility
- Executive reporting and review cadence

## Tech Stack

- React 19
- React Router 7
- Vite 8
- Recharts
- React Icons
- ESLint 9

## Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Create a production build
- `npm run lint` - Run ESLint
- `npm run check` - Run lint and production build together
- `npm run preview` - Preview the production build locally

Note:

- If the global `npm` shim is broken on your machine, the local binaries still work from `node_modules/.bin`.

## Project Structure

```text
src/
  components/
    common/
    layout/
  data/
    platformData.js
  pages/
    Alerts/
    Auth/
    Dashboard/
    Landing/
    Projects/
    Reports/
    Settings/
    Simulation/
    Vendors/
  styles/
```

## Current Phase

This repository is now set up as a strong Phase 1 production frontend, not just a visual prototype. The next logical build steps are:

1. Connect the app shell to real APIs and auth.
2. Introduce a backend service layer for projects, alerts, vendors, and reports.
3. Wire the dashboard to live risk outputs from the ML service.
4. Add real collaboration workflows, audit trails, and report export logic.
5. Introduce role-based access and environment configuration for deployment.

## Verification

The project should be verified with:

```bash
npm run check
```

If needed, you can also run the tools directly:

```bash
.\node_modules\.bin\eslint.cmd .
.\node_modules\.bin\vite.cmd build
```
