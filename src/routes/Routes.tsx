import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import Inicio from '../components/screens/Inicio/Inicio';
import EmpresaComponent from '../components/screens/Empresa/EmpresaComponent';
import SidebarLayout from '../components/ui/common/SideBarLayout/SideBarLayout';
import './routes.css'
import SucursalComponent from '../components/screens/Sucursal/SucursalComponent';
import Insumo from '../components/screens/Insumo/Insumo';
import TableUnidadMedida from '../components/ui/Tables/TableUnidadMedida/TableUnidadMedida';
import Categoria from '../components/screens/Categoria/Categoria';


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
          <Route path="insumos/:sucursalId" element={<Insumo />} />
          <Route path="/unidad-de-medida" element={<TableUnidadMedida />} />
          <Route path="categorias/:idSucursal" element={<Categoria />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default Rutas;
