import React, { ReactNode } from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";

interface ChartCardProps {
    title: string;
    children: ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <Card sx={{ height: "340px" }}>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ChartCard;