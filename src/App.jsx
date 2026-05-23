import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import RootLayout from './layouts/RootLayout';
import Dashboard from './pages/Dashboard';
import ToolContainer from './pages/ToolContainer';
import { AppProvider } from './context/AppContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'tool/:toolId',
        element: <ToolContainer />,
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    </HelmetProvider>
  );
}
