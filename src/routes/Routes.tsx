<<<<<<< Updated upstream
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
=======
// src/routes/Routes.tsx
import React, { useEffect, useState } from 'react';
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import useAuthToken from '../hooks/useAuthToken';
import LoginPage from '../components/screens/Login/Login';
import PrivateRoute from './PrivateRoute';
>>>>>>> Stashed changes
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import Inicio from '../components/screens/Inicio/Inicio';
import EmpresaComponent from '../components/screens/Empresa/EmpresaComponent';
import SidebarLayout from '../components/ui/common/SideBarLayout/SideBarLayout';
import './routes.css'
import SucursalComponent from '../components/screens/Sucursal/SucursalComponent';
import Insumo from '../components/screens/Insumo/Insumo';
import TableUnidadMedida from '../components/ui/Tables/TableUnidadMedida/TableUnidadMedida';
import Categoria from '../components/screens/Categoria/Categoria';
<<<<<<< Updated upstream


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
=======
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida';
import Promocion from '../components/screens/Promocion/Promocion';
import Empleado from '../components/screens/Empleado/Empleado';
import CallbackPage from '../components/auth/CallbackPage';
import EmpresaComponent from '../components/screens/Empresa/EmpresaComponent';

const Routes: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const getToken = useAuthToken();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authToken = await getToken();
        setToken(authToken);
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [getToken, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  console.log('User:', user);
  console.log('Token:', token);

  return (
    <>
      {isAuthenticated && (
        <div className='navbar'>
          <BaseNavbar />
        </div>
      )}
      <RouterRoutes>
        <Route path="/callback" element={<CallbackPage />} />
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/empresa" />} />
            <Route path="/empresa" element={<PrivateRoute component={EmpresaComponent} roles={['admin']} />} />
            <Route path="/empresa/:empresaId" element={<PrivateRoute component={SucursalComponent} roles={['admin']} />} />
            <Route path="/" element={<SidebarLayout />}>
              <Route path="/dashboard/:sucursalId" element={<PrivateRoute component={Inicio} roles={['admin']} />} />
              <Route path="/insumos/:sucursalId" element={<PrivateRoute component={Insumo} roles={['admin', 'empleado']} />} />
              <Route path="/productos/:sucursalId" element={<PrivateRoute component={Producto} roles={['admin', 'cocinero']} />} />
              <Route path="/unidadMedida/:sucursalId" element={<PrivateRoute component={UnidadMedida} roles={['admin', 'empleado']} />} />
              <Route path="/categorias/:sucursalId" element={<PrivateRoute component={Categoria} roles={['admin', 'empleado']} />} />
              <Route path="/promociones/:sucursalId" element={<PrivateRoute component={Promocion} roles={['admin', 'empleado']} />} />
              <Route path="/empleados/:sucursalId" element={<PrivateRoute component={Empleado} roles={['admin']} />} />
            </Route>
            <Route path="*" element={<Navigate to="/empresa" />} />
          </>
        )}
      </RouterRoutes>
    </>
>>>>>>> Stashed changes
  );
}

export default Routes;
