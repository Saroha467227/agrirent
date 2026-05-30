import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Home from '@/pages/Home';
import Catalog from '@/pages/Catalog';
import EquipmentDetail from '@/pages/EquipmentDetail';
import Booking from '@/pages/Booking';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Admin from '@/pages/Admin';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/catalog"
          element={
            <Layout>
              <Catalog />
            </Layout>
          }
        />
        <Route
          path="/equipment/:id"
          element={
            <Layout>
              <EquipmentDetail />
            </Layout>
          }
        />
        <Route
          path="/book/:id"
          element={
            <Layout>
              <Booking />
            </Layout>
          }
        />
        <Route path="/login" element={<Auth />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/admin"
          element={
            <Layout>
              <Admin />
            </Layout>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
