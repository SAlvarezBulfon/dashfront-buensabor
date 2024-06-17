import { Button, Card, CardContent, Typography } from '@mui/material'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ReportesCard.css';
import { Link } from 'react-router-dom';

const ReportesCard = () => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [hasPedidos, setHasPedidos] = useState(false);
    const url = import.meta.env.VITE_API_URL;

    const handleReportRequest = async () => {
        if (!startDate || !endDate) {
            console.error('Por favor selecciona una fecha de inicio y una fecha de fin.');
            return;
        }

        try {
            const response = await fetch(
                `${url}/pedido/countPorFecha?fechaDesde=${startDate.toISOString().split('T')[0]}&fechaHasta=${endDate.toISOString().split('T')[0]}`
            );
            const count = await response.json();
            console.log(count);
            
            if (count > 0) {
                setHasPedidos(true);
            } else {
                setHasPedidos(false);
                alert('No hay pedidos en el rango de fechas seleccionado.');
            }
        } catch (error) {
            console.error('Error al obtener el conteo de pedidos:', error);
        }
    };

    return (
        <>
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Generar Reportes
                    </Typography>
                    <div className='dateStyle'>
                        <DatePicker
                            selected={startDate}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            className="form-control"
                            onChange={(date: Date) => setStartDate(date)}
                            placeholderText="Fecha Inicio"
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={(date: Date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate}
                            className="form-control"
                            placeholderText="Fecha Fin"
                        />
                        {(startDate && endDate) ?
                            <Button onClick={handleReportRequest}>Verificar Pedidos</Button>
                            : null}
                        {hasPedidos && 
                            <Link to={`${url}/estadisticas/excel?fechaDesde=${startDate?.toISOString().split('T')[0]}&fechaHasta=${endDate?.toISOString().split('T')[0]}`}>
                                <Button>Generar Excel</Button>
                            </Link>}
                    </div>
                </CardContent>
            </Card>
        </>
    );
}

export default ReportesCard;