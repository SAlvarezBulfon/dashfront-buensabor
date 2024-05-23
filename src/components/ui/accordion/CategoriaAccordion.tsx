import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Chip, Stack, IconButton, Tooltip } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import ICategoria from "../../../types/ICategoria";

interface CategoriaAccordionProps {
    categoria: ICategoria;
    order: number;
    onEdit: (categoria: ICategoria) => void;
}

const SimpleCategoriaAccordion: React.FC<CategoriaAccordionProps> = ({ categoria, order, onEdit }) => {
    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography>{categoria.denominacion}</Typography>
                    {categoria.esInsumo && (
                        <Chip label="Es insumo" variant="outlined" color="primary" />
                    )}
                    <Tooltip title="Editar">
                        <IconButton size="small" onClick={() => onEdit(categoria)}>
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </AccordionSummary>
            {categoria.subCategorias && categoria.subCategorias.length > 0 && (
                <AccordionDetails>
                    <Stack direction="column" spacing={1}>
                        {categoria.subCategorias.map((subcategoria: ICategoria, index: number) => (
                            !subcategoria.eliminado && (
                                <SimpleCategoriaAccordion
                                    key={index}
                                    categoria={subcategoria}
                                    order={order + 1}
                                    onEdit={onEdit}
                                />
                            )
                        ))}
                    </Stack>
                </AccordionDetails>
            )}
        </Accordion>
    );
};

export default SimpleCategoriaAccordion;
