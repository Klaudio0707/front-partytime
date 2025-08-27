import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; 
import App from './App.tsx';

import Home from './pages/Home/index.tsx';
import Login from './components/Login/index.tsx';
import Register from './components/Register/index.tsx';
import RsvpPage from './pages/RsvpPage/index.tsx';
import Dashboard from './pages/DashBoard/index.tsx';
import ProtectedRoute from './components/ProtectedRoute/index.tsx';
import CreateParty from './pages/CreateParties/index.tsx';
import PartyDetails from './pages/PartyDetails/index.tsx';
import EditParty from './pages/EditParty/index.tsx';
import EditService from './pages/EditService/index.tsx';
import Profile from './pages/Profile/index.tsx';
// ... todos os seus imports de página

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // --- ROTAS PÚBLICAS ---
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/rsvp/:token', element: <RsvpPage /> }, 

      // --- ROTAS PROTEGIDAS ---
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/party/new', element: <CreateParty /> },
          { path: '/party/:id', element: <PartyDetails /> },
          { path: '/party/edit/:id', element: <EditParty /> },
          { path: '/service/edit/:id', element: <EditService /> },
          { path: '/profile', element: <Profile /> }, 
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   
      <RouterProvider router={router} />
    
  </React.StrictMode>
);