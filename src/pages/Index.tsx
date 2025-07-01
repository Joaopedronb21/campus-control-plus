
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import ProfessorDashboard from '@/components/ProfessorDashboard';
import AlunoDashboard from '@/components/AlunoDashboard';

const Index = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'professor':
      return <ProfessorDashboard />;
    case 'aluno':
      return <AlunoDashboard />;
    default:
      return <div>Tipo de usuário não reconhecido</div>;
  }
};

export default Index;
