import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Landing from './pages/Landing';
import APIKeys from './pages/APIKeys';
import Billing from './pages/Billing';
import Analytics from './pages/Analytics';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />}>
           <Route index element={<Overview />} />
           <Route path="keys" element={<APIKeys />} />
           <Route path="billing" element={<Billing />} />
           <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}