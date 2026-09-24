import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button, EmptyState } from '../components/common';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="page">
      <EmptyState icon={Compass} title="Page not found" message="The page you requested does not exist." action={<Button onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>} />
    </div>
  );
}
