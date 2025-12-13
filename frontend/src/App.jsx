import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthentication } from './auth';
import AuthPage from './pages/AuthPage';
import ChatList from './components/ChatList';
import Conversation from './components/Conversation';
import ProtectedRoute from './components/AuthAccess';

const App = () => {
  const { isAuthenticated } = useAuthentication();

  return (
    <Router>
      <Routes>
        {/* ROOT PATH - ALWAYS GO TO LOGIN (no home page) */}
        <Route 
          path="/" 
          element={<Navigate to="/login" replace />} 
        />
        
        {/* PUBLIC ROUTES - Only for non-logged in users */}
        <Route 
          path="/login" 
          element={
            !isAuthenticated ? 
              <AuthPage initialMethod='login' /> 
              : <Navigate to="/chats" replace />
          } 
        />
        <Route 
          path="/register" 
          element={
            !isAuthenticated ? 
              <AuthPage initialMethod='register' /> 
              : <Navigate to="/chats" replace />
          } 
        />
        
        {/* PROTECTED ROUTES - Only for logged in users */}
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <ChatList />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat/:conversationId" 
          element={
            <ProtectedRoute>
              <Conversation />
            </ProtectedRoute>
          } 
        />
        
        {/* REMOVED /home route completely */}
        
        {/* Catch-all route for unknown paths */}
        <Route 
          path="*" 
          element={<Navigate to="/login" replace />} 
        />
      </Routes>
    </Router>
  );
};

export default App;