# MADDY AVIATION — FDTL Management System

**Flight Duty Time Limit Monitoring**

A frontend prototype for MADDY AVIATION's Flight Duty Time Limit (FDTL) management system. Operations staff use it to plan crew duties, check FDTL compliance before assigning crew, and track violations, duty history and reports.

> **Prototype notice:** This is a frontend-only build. All data is mock data, and the FDTL limits in `src/data/fdtlData.js` are placeholders chosen to demonstrate the UI. **They are not official regulatory (DGCA / NSOP) limits.** The real rules will be supplied by the backend calculation engine.

---

## Technology stack

| Concern | Library |
| --- | --- |
| UI | React 19 (JavaScript, no TypeScript) |
| Build / dev server | Vite |
| Routing | React Router |
| HTTP client (for the future API) | Axios |
| Icons | Lucide React |
| Charts | Recharts |
| Styling | Plain CSS with design tokens (CSS custom properties) |

## Getting started

Requirements: Node.js 18 or later.

```bash
npm install
npm run dev
```

Open http://localhost:5173 and sign in with the prototype account:

- **Email:** `admin@maddyaviation.com`
- **Password:** `admin123`

Other scripts:

```bash
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Folder structure

```
src/
├── assets/                  Static assets (logos, images)
├── components/
│   ├── common/              Reusable UI: Button, Badge, Card, Modal, Drawer, Table,
│   │                        Input, Select, DatePicker, StatCard, Tabs, Alert,
│   │                        EmptyState, LoadingState, ErrorState, DetailList, Logo…
│   ├── layout/              Header, Sidebar, MainLayout
│   ├── dashboard/           FlightTable, AttentionList, ComplianceChart, UpcomingDuties
│   ├── calendar/            Calendar, FlightDetailsPanel
│   ├── duty/                DutyStepper, FlightSelector, CrewSelector, FDTLResultCard, Timeline
│   ├── crew/                CrewFormModal, CrewDetailsDrawer
│   ├── flight/              FlightFormModal
│   └── violations/          ViolationDetails
├── context/                 AuthContext, ToastContext, DutyPlannerContext
├── data/                    Mock data (the only place dummy records live)
├── hooks/                   useAsync (loading / error / data for service calls)
├── pages/                   One component per route (FDTL pages in pages/fdtl/)
├── routes/                  AppRoutes, ProtectedRoute, navigation (sidebar config)
├── services/                Service layer: api.js + one service per domain
├── styles/                  variables.css, base.css, layout.css, components.css, pages.css
├── utils/                   Time formatting and status helpers
├── App.jsx
└── main.jsx
```

## Routes

| Path | Page |
| --- | --- |
| `/login` | Login |
| `/dashboard` | FDTL dashboard |
| `/crew` | Crew management |
| `/aircraft` | Aircraft management |
| `/flight-planning` | Flight planning |
| `/fdtl` | FDTL overview |
| `/fdtl/duty-planner` | Duty Planner (4-step workflow) |
| `/fdtl/crew-readiness` | Crew readiness result |
| `/fdtl/calculation-details` | FDTL calculation breakdown |
| `/fdtl/duty-sequence` | Duty sequence timeline |
| `/fdtl/calendar` | Monthly FDTL calendar |
| `/duty-records` | Historical duty records |
| `/fdtl/violations` | FDTL violations |
| `/fdtl/configuration` | Rule packs and limits |
| `/reports` | Report generation |

All routes except `/login` require sign-in (`ProtectedRoute`).

## Architecture

```
React UI → Pages → Reusable Components → Service Layer → Mock Data
```

- **Pages** call **services** only, never `src/data` directly (except for static option lists such as status names).
- **Services** are `async` functions and return the shapes that the future REST API will return.
- **Mock data** lives in `src/data/*.js`: `crewData`, `aircraftData`, `flightData`, `dutyData`, `violationData`, `reportData`, `calendarData` and `fdtlData`.
- Create and update actions (add crew, create flight, resolve violation, generate report, new rule-pack version) change an in-memory copy inside the service, so they persist until the page is reloaded.

### Mock FDTL validation engine

`src/services/fdtlService.js` holds all of the prototype FDTL logic. `validateFDTL({ flightId, date, crew })` checks each crew member for:

- Flight Duty Period (report time → release time)
- Daily flight time
- 28-day cumulative flight time
- Rest before duty (minimum)
- Night duty inside the WOCL window
- Aircraft type authorisation

Each check is marked **ELIGIBLE**, **WARNING** (at or above 85% of a limit) or **VIOLATION** (over the limit). The worst check decides the crew member's overall status. The UI only reads the returned result, so the backend engine can replace this file without any UI changes.

## Connecting the Django REST API

Each service already includes the Axios call it will make. `src/services/api.js` decides whether mock data or the real API is used:

```js
export async function getCrew(filters = {}) {
  if (USE_MOCK) {
    return mockResponse(/* filtered mock data */);
  }
  const { data } = await api.get('/crew/', { params: filters });
  return data;
}
```

To switch to the backend:

1. Copy `.env.example` to `.env.local`:
   ```
   VITE_USE_MOCK=false
   VITE_API_BASE_URL=http://localhost:8000/api
   ```
2. Make the DRF serializers return the same field names the mock data uses (`licenceNumber`, `authorizedAircraft`, `etd`, `eta`…), or map the fields inside the services.
3. Update `authService.login` if your token format is different. The Axios interceptor sends `Authorization: Bearer <token>` using the `fdtl_token` value stored in localStorage.

Planned endpoints:

| Method | Endpoint | Service function |
| --- | --- | --- |
| POST | `/api/auth/login/` | `authService.login` |
| GET | `/api/crew/` | `crewService.getCrew` |
| GET / POST / PATCH | `/api/crew/:id/` | `getCrewById`, `createCrew`, `updateCrew` |
| GET | `/api/aircraft/` | `aircraftService.getAircraft` |
| GET / POST / PATCH | `/api/flights/` | `flightService.getFlights`, `saveFlight` |
| GET | `/api/duties/` | `dutyService.getDuties` |
| GET | `/api/duties/sequence/` | `dutyService.getDutySequence` |
| POST | `/api/fdtl/validate/` | `fdtlService.validateFDTL` |
| GET | `/api/fdtl/calendar/?month=YYYY-MM` | `dutyService.getCalendar` |
| GET / POST | `/api/fdtl/rule-packs/` | `fdtlService.getRulePacks`, `createRulePackVersion` |
| GET / PATCH | `/api/violations/` | `violationService.getViolations`, `updateViolationStatus` |
| GET / POST | `/api/reports/` | `reportService.getReports`, `generateReport` |

## Branding

The company name is **MADDY AVIATION** everywhere in the UI: login page, header, sidebar, dashboard and the browser title (`MADDY AVIATION | FDTL Management System`). The logo is an SVG placeholder in `src/components/common/Logo.jsx` and `public/favicon.svg`. Replace both with the final artwork when it is ready.
