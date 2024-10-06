import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "../ui/button"
import ModeToggle from "../mode-toggle"
import { userApi } from '../../services/api';
import { Alert, AlertDescription } from "../ui/alert";

const Header = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const isLoggedIn = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'reader';

  const handleLogout = async () => {
    try {
      await userApi.logout();
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      navigate('/');
    } catch (error) {
      setError('Logout failed. Please try again.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <header className="bg-background text-foreground">
      <div className="card-glass card-glass-header">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dju6ic4yl/image/upload/v1728227358/Logo_hlh61o.svg" 
              alt="Logo" 
              className="h-10 w-auto"
            />
          </Link>
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" asChild><Link to="/">Home</Link></Button>
            <Button variant="ghost" asChild><Link to="/articles">Articles</Link></Button>
            <Button variant="ghost" asChild><Link to="/about">About</Link></Button>
            {isLoggedIn ? (
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            ) : (
              <>
                <Button variant="outline" asChild><Link to="/login">Login</Link></Button>
                <Button variant="outline" asChild><Link to="/register">Register</Link></Button>
              </>
            )}
           
          </nav>
        </div>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {(userRole === 'admin' || userRole === 'writer') && (
        <div className="card-glass">
          <div className="container mx-auto px-4 py-2 flex justify-start items-center space-x-4">
            <Button variant="ghost" asChild><Link to="/admin/articles">Manage Articles</Link></Button>
            {userRole === 'admin' && (
              <>
                <Button variant="ghost" asChild><Link to="/admin/tags">Manage Tags</Link></Button>
                <Button variant="ghost" asChild><Link to="/admin/categories">Manage Categories</Link></Button>
                <Button variant="ghost" asChild><Link to="/admin/users">Manage Users</Link></Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;