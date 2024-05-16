import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { cilBarChart, cilBuilding, cilCart, cilFastfood, cilPeople } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarNav } from "@coreui/react";
import '@coreui/coreui/dist/css/coreui.min.css';
import { cilDollar } from "@coreui/icons";


const BasicSidebar: React.FC = () => {
    const { empresaId } = useParams<{ empresaId: string }>();
    return (
        <div>
            <CSidebar className="border-end d-flex flex-column" style={{ height: '100vh' }}>
                <CSidebarNav>
                    <CNavTitle>
                        Dashboard
                    </CNavTitle>

                    <CNavItem>
                        <Link to={`/empresa/${empresaId}`} className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilBuilding} />
                            Sucursales
                        </Link>
                    </CNavItem>
                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilFastfood} />
                                Productos
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/productos" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Productos
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/categorias" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Categorías
                            </Link>
                        </CNavItem>
                    </CNavGroup>

                    <CNavItem>
                        <Link to="/promociones" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilDollar} />
                            Promociones
                        </Link>
                    </CNavItem>

                    <CNavGroup
                        toggler={
                            <>
                                <CIcon customClassName="nav-icon" icon={cilPeople} />
                                Empleados
                            </>
                        }
                    >
                        <CNavItem>
                            <Link to="/empleados" className="nav-link" >
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Lista de Empleados
                            </Link>
                        </CNavItem>
                        <CNavItem>
                            <Link to="/roles" className="nav-link">
                                <span className="nav-icon"><span className="nav-icon-bullet"></span></span>
                                Roles
                            </Link>
                        </CNavItem>
                    </CNavGroup>
                    <CNavItem>
                        <Link to="/insumos" className="nav-link">
                            <CIcon customClassName="nav-icon" icon={cilCart} />
                            Insumos
                        </Link>
                    </CNavItem>
                    <CNavItem>
                        <Link to={`empresa/estadisticas/${empresaId}`} className="nav-link" >
                            <CIcon customClassName="nav-icon" icon={cilBarChart} />
                            Estadísticas
                        </Link>
                    </CNavItem>
                </CSidebarNav>
            </CSidebar>
        </div>

        
    );
}

export default BasicSidebar;
