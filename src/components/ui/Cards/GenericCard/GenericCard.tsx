import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader, Tooltip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import IImagen from "../../../../types/IImagen";
import "./genericCard.css";

interface Action {
  icon: ReactNode;
  tooltip: string;
  link?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface GenericCardProps {
  title: string;
  subtitle?: string;
  images: IImagen[];
  actions: Action[];
  children?: ReactNode;
}

const GenericCard: React.FC<GenericCardProps> = ({ title, subtitle, images, actions = [], children }) => {
  return (
    <Card sx={{ width: 300, marginY: 2, marginX: 2, backgroundColor: '#f5f5f5', color: '#333' }}>
    {images.length > 1 ? (
      <Carousel prevLabel="" nextLabel="" className="custom-carousel">
        {images.map((image, index) => (
          <Carousel.Item key={index} className="carousel-item">
            <div className="image-container">
              <img src={image.url} alt={`${title} image ${index + 1}`} className="carousel-image" />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    ) : (
      <div className="image-container">
        <img src={images[0].url} alt={`${title} image 1`} className="carousel-image" />
      </div>
    )}
    <CardHeader title={title} subheader={subtitle} action={renderActions(actions)} sx={{ backgroundColor: '#fafafa' }} />
    <CardContent>{children}</CardContent>
  </Card>
  );
};

const renderActions = (actions: Action[]) => {
  return actions.map((action, index) => (
    <Tooltip title={action.tooltip} key={index}>
      <IconButton
        component={action.link ? Link : "button"}
        to={action.link}
        onClick={action.onClick}
        aria-label={action.tooltip}
        disabled={action.disabled}
        sx={{ color: '#fb6376', '&:hover': { color: '#d73754' } }}
      >
        {action.icon}
      </IconButton>
    </Tooltip>
  ));
};

export default GenericCard;
