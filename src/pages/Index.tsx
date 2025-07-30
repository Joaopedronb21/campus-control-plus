
import { useAuth } from '@/components/AuthContext';
import LoginForm from '@/components/LoginForm';
import AdminDashboard from '@/components/AdminDashboard';
import ProfessorDashboard from '@/components/ProfessorDashboard';
import AlunoDashboard from '@/components/AlunoDashboard';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

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
