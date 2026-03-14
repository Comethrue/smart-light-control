import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Control } from './pages/Control';
import { Connect } from './pages/Connect';
import { Settings } from './pages/Settings';
import { Simulation } from './pages/Simulation';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Terms } from './pages/Terms';
import { Support } from './pages/Support';
import { About } from './pages/About';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Control />} />
          <Route path="connect" element={<Connect />} />
          <Route path="settings" element={<Settings />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="privacy" element={<PrivacyPolicy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="support" element={<Support />} />
          <Route path="about" element={<About />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
