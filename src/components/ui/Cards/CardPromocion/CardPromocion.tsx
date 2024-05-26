import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

interface PromocionCardProps {
    promocion: any;
    onEdit: (promocion: any) => void;
}

const PromocionCard: React.FC<PromocionCardProps> = ({ promocion, onEdit }) => {
    return (
        <Box sx={{ maxWidth: 300 }}> {/* Ajusta el ancho máximo según tus necesidades */}
        <Box>
            <Card>
                <CardContent>
                    <Typography variant="h5">{promocion.denominacion}</Typography>
                    <Typography variant="body2">{promocion.descripcionDescuento}</Typography>
                    <Typography variant="body2">Fecha Desde: {promocion.fechaDesde}</Typography>
                    <Typography variant="body2">Fecha Hasta: {promocion.fechaHasta}</Typography>
                    <Typography variant="body2">Hora Desde: {promocion.horaDesde}</Typography>
                    <Typography variant="body2">Hora Hasta: {promocion.horaHasta}</Typography>
                    <Typography variant="body2">Precio Promocional: {promocion.precioPromocional}</Typography>
                    <Button onClick={() => onEdit(promocion)}>Editar</Button>
                </CardContent>
            </Card>
        </Box>
        </Box>
    );
};

export default PromocionCard;
