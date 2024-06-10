import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import EmpleadoPost from '../../types/post/EmpleadoPost';
import IEmpleado from '../../types/Empleado';

interface RutaPrivadaProps {
    component: React.ComponentType;
    roles?: string[];
}
const RutaPrivada: React.FC<RutaPrivadaProps> = ({ component: Component, roles }) => {
    const [empleado, setEmpleado] = useState<IEmpleado | null>(null);
    const [idSucursal, setIdSucursal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const URL = import.meta.env.VITE_API_URL;
    const userDataString = localStorage.getItem('usuario');

    useEffect(() => {
        const fetchEmpleado = async () => {
            if (userDataString) {
                const userData = JSON.parse(userDataString);

                if (!userData) {
                    setLoading(false);
                    return;
                }

                try {
                    const response = await fetch(`${URL}/empleado/findByEmail?email=${userData.email}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const empleadoData: IEmpleado = await response.json();
                    setEmpleado(empleadoData);
                    setIdSucursal(empleadoData.sucursal.id); // Extraer el id de la sucursal
                } catch (error) {
                    console.error('Error fetching empleado:', error);
                }
            }
            setLoading(false);
        };

        fetchEmpleado();
    }, [URL, userDataString]);

    if (loading) {
        return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se obtienen los datos
    }

    if (!userDataString) {
        return <Navigate to="/login" replace />;
    }

    const userData = JSON.parse(userDataString);
    const rolesA = userData["https://my-app.example.com/roles"];

    if (roles && !roles.some(role => rolesA.includes(role))) {
        return <Navigate to={`/dashboard/${idSucursal}`} replace />;
    }
    

    return <Component />;
};

export default RutaPrivada;
