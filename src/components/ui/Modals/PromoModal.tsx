import React from 'react';
import { Modal, Box, Typography, Button, Card, CardContent, List, ListItem, ListItemText } from '@mui/material';

interface PromocionModalProps {
    open: boolean;
    onClose: () => void;
    promocion: any;
}

const PromoModal: React.FC<PromocionModalProps> = ({ open, onClose, promocion }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    maxWidth: 600,
                    width: '100%',
                }}
            >
                <Typography variant="h5" gutterBottom>
                    Detalles de la Promoción
                </Typography>
                <Card variant="outlined">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {promocion && promocion.denominacion}
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            {promocion && promocion.descripcionDescuento}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Fecha de Inicio: {promocion && promocion.fechaDesde}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Fecha de Fin: {promocion && promocion.fechaHasta}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Hora Desde: {promocion && promocion.horaDesde}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Hora Hasta: {promocion && promocion.horaHasta}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Precio Promocional: ${promocion && promocion.precioPromocional}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Detalles:
                        </Typography>
                        <List>
                            {promocion && promocion.detalles.map((detalle: any, index: number) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={`Cantidad: ${detalle.cantidad}`}
                                        secondary={`Artículo: ${detalle.insumo ? detalle.insumo.denominacion : detalle.manufacturado.denominacion}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
                <Button 
                    onClick={onClose} 
                    sx={{ mt: 2, bgcolor: '#e91e63', color: '#fff', '&:hover': { bgcolor: '#d81b60' } }}
                >
                    Cerrar
                </Button>
            </Box>
        </Modal>
    );
};

export default PromoModal;
