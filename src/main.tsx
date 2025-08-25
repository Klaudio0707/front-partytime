import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './pages/Home'
import App from './App.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'; 
import Login from './components/Login';
import Register from './components/Register';
import CreateParty from './pages/CreateParties/index.tsx';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/home',          
        element: <Home />,
      },
       {
        path: '/register', 
        element: <Register />,
      },
      {
       path:'/partie/new',
       element: <CreateParty />
        
       },
      {
        path: '/login',
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);