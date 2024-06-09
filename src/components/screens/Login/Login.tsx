import { Box, Button, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      sx={{
        backgroundImage: `url(https://images.unsplash.com/photo-1633886038251-66242d6cf688?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "32px",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "16px" }} gutterBottom>
          ¡Bienvenido!
        </Typography>
        <Typography variant="body1" sx={{ marginBottom: "32px" }} paragraph>
          Por favor, inicia sesión para acceder al dashboard de administración.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{
            bgcolor: "#fb6376",
            "&:hover": {
              bgcolor: "#d73754",
            },
          }}
          onClick={() => loginWithRedirect()}
        >
          Iniciar sesión
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
