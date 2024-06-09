import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import BaseNavbar from '../components/ui/common/Navbar/BaseNavbar';
import Inicio from '../components/screens/Inicio/Inicio';
import SidebarLayout from '../components/ui/common/SideBarLayout/SideBarLayout';
import SucursalComponent from '../components/screens/Sucursal/SucursalComponent';
import Insumo from '../components/screens/Insumo/Insumo';
import Producto from '../components/screens/Producto/Producto';
import Categoria from '../components/screens/Categoria/Categoria';
import UnidadMedida from '../components/screens/UnidadMedida/UnidadMedida';
import Promocion from '../components/screens/Promocion/Promocion';
import Empleado from '../components/screens/Empleado/Empleado';
import CallbackPage from '../components/auth/CallbackPage';
import { useAuth0 } from '@auth0/auth0-react';
import Login from '../components/screens/Login/Login';
import EmpresaComponent from '../components/screens/Empresa/EmpresaComponent';
import { AuthenticationGuard } from '../components/auth/AuthenticationGuard';
import useAuthToken from '../hooks/useAuthToken';

const Rutas: React.FC = () => {
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
      <Routes>
        <Route path="/callback" element={<CallbackPage />} />
        {!isAuthenticated ? (
          <>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Navigate to="/empresa" />} />
            <Route path="/empresa" element={<EmpresaComponent />} />
            <Route path="/empresa/:empresaId" element={<SucursalComponent />} />
            <Route path="/" element={<SidebarLayout />}>
              <Route path="/dashboard/:sucursalId" element={<AuthenticationGuard component={Inicio} />} />
              <Route path="/insumos/:sucursalId" element={<AuthenticationGuard component={Insumo} />} />
              <Route path="/productos/:sucursalId" element={<AuthenticationGuard component={Producto} />} />
              <Route path="/unidadMedida/:sucursalId" element={<AuthenticationGuard component={UnidadMedida} />} />
              <Route path="/categorias/:sucursalId" element={<AuthenticationGuard component={Categoria} />} />
              <Route path="/promociones/:sucursalId" element={<AuthenticationGuard component={Promocion} />} />
              <Route path="/empleados/:sucursalId" element={<AuthenticationGuard component={Empleado} />} />
            </Route>
            <Route path="*" element={<Navigate to="/empresa" />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Rutas;
