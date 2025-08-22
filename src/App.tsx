import {  Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <AuthProvider>
      <ToastContainer />
      <Header />
      <main>
        <Outlet />
      </main>
    </AuthProvider>
  );
}

export default App;
