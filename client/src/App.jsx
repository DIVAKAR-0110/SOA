import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import UserDashboard from "./pages/user/UserDashboard";
import CategoryPage from './modules/complaint/category';
import ComplaintForm from './pages/user/ComplaintForm';
import MyComplaints from './pages/user/MyComplaints';
import ViewStatus from './pages/user/ViewStatus';
import VoiceNameForm from './pages/user/VoiceNameForm';
import Auth from './pages/Auth';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <Auth />} />

        {/* Protected routes */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/categories" 
          element={
            <ProtectedRoute>
              <CategoryPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaint/new" 
          element={
            <ProtectedRoute>
              <ComplaintForm />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/MyComplaints" 
          element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/complaints/status" 
          element={
            <ProtectedRoute>
              <ViewStatus />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/a" 
          element={
            <ProtectedRoute>
              <VoiceNameForm />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
