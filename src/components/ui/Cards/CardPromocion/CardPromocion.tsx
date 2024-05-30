import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, CardMedia, IconButton, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, Edit } from '@mui/icons-material';

interface PromocionCardProps {
    promocion: any;
    onEdit: (promocion: any) => void;
    onViewDetails: (promocion: any) => void;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ promocion, onEdit, onViewDetails }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handlePrevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? promocion.imagenes.length - 1 : prevIndex - 1));
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex === promocion.imagenes.length - 1 ? 0 : prevIndex + 1));
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Card>
                {promocion.imagenes && promocion.imagenes.length > 0 && (
                    <Box sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            height="190"
                            image={promocion.imagenes[currentImageIndex].url}
                            alt={promocion.denominacion}
                            sx={{ width: '100%' }}
                        />
                        <IconButton
                            onClick={handlePrevImage}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '0',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <ArrowBackIos />
                        </IconButton>
                        <IconButton
                            onClick={handleNextImage}
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: '0',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            }}
                        >
                            <ArrowForwardIos />
                        </IconButton>
                    </Box>
                )}
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h5">{promocion.denominacion}</Typography>
                        <IconButton onClick={() => onEdit(promocion)}>
                            <Edit />
                        </IconButton>
                    </Box>
                    <Typography variant="body2">{promocion.descripcionDescuento}</Typography>
                    <Typography variant="body2">${promocion.precioPromocional}</Typography>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button 
                            variant="outlined" 
                            onClick={() => onViewDetails(promocion)} 
                            sx={{ 
                                color: '#e91e63', 
                                borderColor: '#e91e63', 
                                '&:hover': { 
                                    bgcolor: '#e91e63', 
                                    color: '#fff',
                                    borderColor: '#e91e63',
                                } 
                            }}
                        >
                            Ver Detalles
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default PromocionCard;
