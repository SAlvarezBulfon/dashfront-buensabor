import { Box, Button } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {getRanking} from '../../../services/EstadisticasService';

const BasePie = () => {
    const [chartData, setChartData] = useState<{ id: number, value: number, label: string }[]>([]);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const fetchData = async (start: Date, end: Date) => {
        try {
            const data = await getRanking(formatDate(start), formatDate(end));
            const formattedData = data.map((item, index) => ({
                id: index,
                value: item.countVentas,
                label: item.denominacion
            }));
            setChartData(formattedData);
            console.log(chartData, "chartdata");
            
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
            <Box>
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
            <Box>
                {(chartData.length == 0) ? <span> No hay informacion para mostrar un grafico</span> :
                <PieChart
                    colors={['#5D2A42', '#FB6376', '#FCB1A6']}
                    series={[
                        {
                            data: chartData,
                        },
                    ]}
                    width={400}
                    height={200}
                />}
            </Box>
        </>
    );
};

export default BasePie;
