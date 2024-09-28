import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './presentation/contexts/AuthContext';
import { TodoProvider } from './presentation/contexts/TodoContext';
import { LoginPage } from './presentation/pages/LoginPage';
import { RegisterPage } from './presentation/pages/RegisterPage';
import { TodoPage } from './presentation/pages/TodoPage';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" />;
};

const PublicRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/todos" /> : element;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <TodoProvider>
          <Routes>
            <Route path="/login" element={<PublicRoute element={<LoginPage />} />} />
            <Route path="/register" element={<PublicRoute element={<RegisterPage />} />} />
            <Route path="/todos" element={<PrivateRoute element={<TodoPage />} />} />
            <Route path="/" element={<Navigate to="/todos" />} />
          </Routes>
        </TodoProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;