
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useAuth } from './AuthContext';
import { LogOut, Bell, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 hover:bg-purple-200';
      case 'professor':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      case 'aluno':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'professor':
        return 'Professor';
      case 'aluno':
        return 'Aluno';
      default:
        return role;
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold gradient-text">Campus Control Plus</h1>
          {user && (
            <Badge className={getRoleBadgeColor(user.role)}>
              {getRoleLabel(user.role)}
            </Badge>
          )}
        </div>
        
        {user && (
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {user.avatar || user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
