import {  Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
   <AuthProvider>
      <ToastContainer />
      <div className="app_container">
      <Header />
      <main className="container">
        <Outlet />
      </main>
      </div>
    </AuthProvider>
  );
}

export default App;
