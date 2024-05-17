import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import Inicio from '../components/screens/Inicio/Inicio';
import EmpresaComponent from '../components/screens/Empresa/EmpresaComponent';
import SidebarLayout from '../components/ui/common/SideBarLayout/SideBarLayout';
import './routes.css'
import SucursalComponent from '../components/screens/Sucursal/SucursalComponent';


const Rutas: React.FC = () => {
  return (
    <Router>
      <div className='navbar'>
        <BaseNavbar />
      </div>
      <Routes>
        <Route path="/" element={<EmpresaComponent />} />
        <Route path="/empresa/:empresaId" element={<SucursalComponent />} />
          <Route element={<SidebarLayout />}>
          <Route path="dashboard/:sucursalId" element={<Inicio />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Rutas;
