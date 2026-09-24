import {
  LayoutDashboard,
  Users,
  Plane,
  Route,
  ShieldCheck,
  FileBarChart,
  Settings,
} from 'lucide-react';

/** Sidebar definition. Paths must match routes/AppRoutes.jsx. */
export const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Crew', path: '/crew', icon: Users },
  { label: 'Aircraft', path: '/aircraft', icon: Plane },
  { label: 'Flight Planning', path: '/flight-planning', icon: Route },
  {
    label: 'FDTL',
    path: '/fdtl',
    icon: ShieldCheck,
    children: [
      { label: 'Overview', path: '/fdtl', end: true },
      { label: 'Duty Planner', path: '/fdtl/duty-planner' },
      { label: 'Crew Readiness', path: '/fdtl/crew-readiness' },
      { label: 'FDTL Calendar', path: '/fdtl/calendar' },
      { label: 'Duty Records', path: '/duty-records' },
      { label: 'Violations', path: '/fdtl/violations' },
    ],
    // Extra paths that should keep the FDTL group highlighted
    matches: ['/fdtl', '/duty-records'],
  },
  { label: 'Reports', path: '/reports', icon: FileBarChart },
  { label: 'Configuration', path: '/fdtl/configuration', icon: Settings },
];
