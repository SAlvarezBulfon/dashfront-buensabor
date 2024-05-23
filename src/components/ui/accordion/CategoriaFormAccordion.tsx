import React, { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ICategoria from "../../../types/ICategoria";

interface CategoriaFormAccordionProps {
    onAddSubcategoria: (subcategoria: ICategoria) => void;
}

const CategoriaFormAccordion: React.FC<CategoriaFormAccordionProps> = ({
    onAddSubcategoria
}) => {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [denominacion, setDenominacion] = useState<string>("");

    const handleExpand = () => setExpanded(!expanded);

    const handleAddCategoria = () => {
        // Crear una nueva subcategoría con la denominación ingresada
        const nuevaSubcategoria: ICategoria = {
            denominacion: denominacion,
            subCategorias: [],
            esInsumo: false,
            id: 0, 
            eliminado: false 
        };

        // Llamar a la función proporcionada por el padre para agregar la subcategoría
        onAddSubcategoria(nuevaSubcategoria);

        // Limpiar el campo de denominación después de agregar la subcategoría
        setDenominacion("");
    };

    const handleDenominacionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDenominacion(e.target.value);
    };

    return (
        <Accordion expanded={expanded} onChange={handleExpand}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography marginRight={1}>Denominación:</Typography>
                <TextField
                    size="small"
                    name="denominacion"
                    value={denominacion}
                    onChange={handleDenominacionChange}
                />
                <Stack direction="row" alignSelf="flex-end" spacing={-1}>
                    <Tooltip title="Agregar subcategoría">
                        <IconButton size="medium" onClick={handleAddCategoria}>
                            <AddCircleOutlineIcon fontSize="medium" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                {/* Aquí colocamos el contenido del formulario */}
                {/* Podemos agregar más campos o componentes */}
            </AccordionDetails>
        </Accordion>
    );
};

export default CategoriaFormAccordion;
