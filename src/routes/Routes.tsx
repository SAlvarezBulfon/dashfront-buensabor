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
import RutaPrivada from '../components/RutaPrivada/RutaPrivada';

const Rutas: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const getToken = useAuthToken();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

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

  localStorage.setItem('usuario', JSON.stringify(user));
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
            <Route path="/empresa" element={<RutaPrivada component={EmpresaComponent} roles={["ADMIN"]}/> } />
            <Route path="/empresa/:empresaId" element={<RutaPrivada component={SucursalComponent} roles={["ADMIN"]}/> } />
            <Route path="/" element={<SidebarLayout />}>
              <Route path="/dashboard/:sucursalId" element={<RutaPrivada component={Inicio} roles={["ADMIN", "COCINERO", "EMPLEADO"]} />} />
              <Route path="/insumos/:sucursalId" element={<RutaPrivada component={Insumo} roles={["EMPLEADO","ADMIN"]}/>} />
              <Route path="/productos/:sucursalId" element={<RutaPrivada component={Producto} roles={["ADMIN", "COCINERO", "EMPLEADO"]} />} />
              <Route path="/unidadMedida/:sucursalId" element={<RutaPrivada component={UnidadMedida} roles={["ADMIN","EMPLEADO"]} />} />
              <Route path="/categorias/:sucursalId" element={<RutaPrivada component={Categoria} roles={["ADMIN", "EMPLEADO"]}/>} />
              <Route path="/promociones/:sucursalId" element={<RutaPrivada component={Promocion} roles={["ADMIN", "EMPLEADO"]}/>} />
              <Route path="/empleados/:sucursalId" element={<RutaPrivada component={Empleado} roles={["ADMIN"]}/>} />
            </Route>
            <Route path="*" element={<Navigate to="/empresa" />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default Rutas;
