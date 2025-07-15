import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import CustomerList from '@/components/customers/CustomerList';
import CustomerForm from '@/components/customers/CustomerForm';

import LotList from '@/components/lots/LotList';
import LotForm from '@/components/lots/LotForm';

const AppRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/customers" replace />} />

    <Route path="/customers">
      <Route index element={<CustomerList />} />
      <Route path=":mode/:code?" element={<CustomerForm />} />
    </Route>

    <Route path="/lots">
      <Route index element={<LotList />} />
      <Route path=":mode/:id?" element={<LotForm />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<p>Not Found</p>} />
  </Routes>
);

export default AppRouter;

