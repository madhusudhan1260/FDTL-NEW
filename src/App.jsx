import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DutyPlannerProvider } from './context/DutyPlannerContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <DutyPlannerProvider>
            <AppRoutes />
          </DutyPlannerProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
