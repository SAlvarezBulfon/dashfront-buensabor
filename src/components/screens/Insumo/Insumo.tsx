
import { Container } from '@mui/material';
import TableUnidadMedida from '../../ui/Tables/TableUnidadMedida/TableUnidadMedida';
import TableInsumo from '../../ui/Tables/TableInsumos/TableInsumos';




const Insumo = () => {
  return (
    <Container maxWidth="lg" sx={{mt: 10}}>
        <TableInsumo />
        <TableUnidadMedida/>
    </Container>
  );
};

export default Insumo;
