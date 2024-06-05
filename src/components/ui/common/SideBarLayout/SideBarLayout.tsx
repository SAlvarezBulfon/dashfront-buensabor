import React from 'react';
import { Outlet } from 'react-router-dom';
import BasicSidebar from '../Sidebar/BasicSidebar';
import '../../../../routes/routes.css';

const SidebarLayout: React.FC = () => {
  return (
    <div>
      <div className="sidebar">
        <BasicSidebar />
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

export default SidebarLayout;
