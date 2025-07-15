import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Theme, presetGpnDefault } from '@consta/uikit/Theme';
import { Button } from '@consta/uikit/Button';

import AppRouter from '@/router/AppRouter';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
      <Button
        label="Customers"
        view="primary"
        onClick={() => navigate('/customers')}
        style={{ marginRight: 8 }}
      />
      <Button
        label="Lots"
        view="primary"
        onClick={() => navigate('/lots')}
      />
    </header>
  );
};

const App: React.FC = () => (
  <Theme preset={presetGpnDefault}>
      <Navigation />
      <main style={{ padding: 24 }}>
        <AppRouter />
      </main>
  </Theme>
);

export default App;

