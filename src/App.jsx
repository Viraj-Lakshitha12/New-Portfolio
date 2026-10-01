import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ScrollToTop from './components/ScrollToTop';
import KonamiCode from './components/KonamiCode';
import PwaInstallPrompt from './components/PwaInstallPrompt';
import Home from '@/pages/Home';
import { I18nProvider } from '@/lib/i18n-context';

function App() {
  return (
    <I18nProvider>
      <Router>
        <ScrollToTop />
        <KonamiCode />
        <PwaInstallPrompt />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Analytics />
      </Router>
    </I18nProvider>
  )
}

export default App