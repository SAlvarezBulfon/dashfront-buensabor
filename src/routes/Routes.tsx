import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import BasicSidebar from '../components/ui/common/Sidebar/BasicSidebar';

import './routes.css'; 
import Inicio from '../components/screens/Inicio/Inicio';
import Empresa from '../components/screens/Empresa/Empresa';
import Sucursal from '../components/screens/Sucursal/Sucursal';


const Rutas: React.FC = () => {
  return (
    <Router>
      <div className='navbar'>
      <BaseNavbar />
      </div>
        <div className="sidebar">
          <BasicSidebar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/empresas" element={<Empresa />} />
            <Route path="/empresas/:empresaId" element={<Sucursal />} />
          </Routes>
        </div>
    </Router>
  );
}

export default Rutas;

