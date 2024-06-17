import { Box, Button } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { getIngresosMensuales } from '../../../services/EstadisticasService';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { IIngresosMensuales } from '../../../types/RecaudacionesMensuales';

const BaseBar = () => {
    const [chartData, setChartData] = useState<IIngresosMensuales[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const fetchData = async (start: Date, end: Date) => {
        try {
            const data = await getIngresosMensuales(formatDate(start), formatDate(end));
            setChartData(data);
        } catch (error) {
            console.error("Error al cargar los datos del gráfico:", error);
        }
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const handleFetchData = () => {
        if (startDate && endDate) {
            fetchData(startDate, endDate);
        }
    };

    return (
        <>
            <Box >
                <DatePicker
                    selected={startDate}
                    onChange={(date: Date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="form-control"
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
                <Button onClick={handleFetchData}>Crear</Button>
            </Box>
            <Box textAlign="center">
                {(chartData.length == 0) ? <span> No hay informacion para mostrar un grafico</span> :
                    <BarChart
                        xAxis={[
                            {
                                id: 'meses',
                                data: chartData.map(item => item.mes),
                                scaleType: 'band',
                            },
                        ]}
                        series={[
                            {
                                data: chartData.map(item => item.ingresos),
                            },
                        ]}
                        width={420}
                        height={300}
                    />}
            </Box>
        </>
    );
};

export default BaseBar;