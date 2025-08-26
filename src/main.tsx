import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// CSS e Componente Principal
import './index.css'; 
import App from './App.tsx';


// Páginas e Componentes
import Home from './pages/Home';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/DashBoard';       // 👈 1. Importe o Dashboard
import CreateParty from './pages/CreateParties'; // Corrigi o caminho de 'CreateParties'
import PartyDetails from './pages/PartyDetails';
import EditParty from './pages/EditParty';
import ProtectedRoute from './components/ProtectedRoute'; // 👈 2. Importe a Rota Protegida
import EditService from './pages/EditService/index.tsx';
import RsvpPage from './pages/RsvpPage/index.tsx';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // O layout principal (com Header, Footer)
    children: [
  
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      
    
      {
        element: <ProtectedRoute />, // 👈 3. Nosso "segurança" fica aqui
        children: [
          {
            path: '/dashboard',     // Nova rota para o painel do usuário
            element: <Dashboard />,
          },
          {
            path: '/party/new',     // Corrigido de 'partie' para 'party'
            element: <CreateParty />,
          },
          {
            path: '/party/:id',
            element: <PartyDetails />,
          },
          {
            path:'/party/edit/:id',
            element:<EditParty />,
          },
          {
            path: '/service/edit/:id',
            element: <EditService />,
          },
           {
             path: '/rsvp/:token',
             element: <RsvpPage />,
           },{

             path: '/profile',
              element: <Profile />,
            },
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