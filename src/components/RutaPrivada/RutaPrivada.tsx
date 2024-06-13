import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import IEmpleado from '../../types/Empleado';
import { useAuth0 } from '@auth0/auth0-react';
import Swal, { SweetAlertIcon } from 'sweetalert2';

interface RutaPrivadaProps {
    component: React.ComponentType;
    roles?: string[];
}
const RutaPrivada: React.FC<RutaPrivadaProps> = ({ component: Component, roles }) => {
    const [, setEmpleado] = useState<IEmpleado | null>(null);
    const [idSucursal, setIdSucursal] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const URL = import.meta.env.VITE_API_URL;
    const userDataString = localStorage.getItem('usuario');
    const {logout} = useAuth0();

    const showModal = (title: string , text: string, icon: SweetAlertIcon) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            customClass: {
                container: "my-swal",
            },
            confirmButtonText: 'OK',
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
            }
        });
      };

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
    const rol = userData["https://my-app.example.com/roles"][0];

    if (roles && !roles.includes(rol) && idSucursal) {
        return <Navigate to={`/dashboard/${idSucursal}`} replace />;
    }else if(!idSucursal){
        showModal("Error", "El usuario no pertenece a una sucursal, consulte al administrador.", "error");
    }else if(roles){
        showModal("Error", "El usuario no tiene ningun rol, consulte al administrador.", "error");
    }
    

    return <Component />;
};

export default RutaPrivada;
