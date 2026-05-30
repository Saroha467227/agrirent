import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Equipment from './pages/Equipment';
import EquipmentDetail from './pages/EquipmentDetail';
import Checkout from './pages/Checkout';
import OwnerEquipment from './pages/OwnerEquipment';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const PlaceholderPage = ({ title, icon }) => (
  <div className="min-h-screen" style={{ paddingTop: '80px' }}>
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="rounded-2xl p-8 animate-fade-in-up"
        style={{
          opacity: 0,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(24px)',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
            style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)' }}
          >
            {icon || '📄'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">This feature module is coming soon.</p>
          </div>
        </div>
        <div
          className="rounded-xl p-5 mt-4"
          style={{
            background: 'rgba(16, 185, 129, 0.05)',
            border: '1px solid rgba(16, 185, 129, 0.15)',
          }}
        >
          <p className="text-sm text-emerald-700 font-medium">
            🚧 This page is ready for the next feature module. The route is protected and accessible only to authenticated users.
          </p>
        </div>
      </div>
    </section>
  </div>
);

function App() {
  return (
    <Router>
      <div className="flex min-h-screen flex-col bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />

            <Route element={<PrivateRoute />}>
              <Route path="/checkout/:id" element={<Checkout />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/farmer/dashboard" element={<Dashboard role="farmer" />} />
              <Route path="/owner/dashboard" element={<Dashboard role="owner" />} />
              <Route path="/admin/dashboard" element={<Dashboard role="admin" />} />
              <Route path="/bookings" element={<PlaceholderPage title="My Bookings" icon="📋" />} />
              <Route path="/owner/equipment" element={<OwnerEquipment />} />
              <Route path="/owner/bookings" element={<PlaceholderPage title="Owner Bookings" icon="📅" />} />
              <Route path="/admin/users" element={<PlaceholderPage title="User Management" icon="👥" />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
