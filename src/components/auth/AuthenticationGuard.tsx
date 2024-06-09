import { withAuthenticationRequired } from "@auth0/auth0-react";
import { CircularProgress, Typography } from "@mui/material";

type Props = {
  component: React.ComponentType<object>;
};

export const AuthenticationGuard = ({ component }: Props) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
        <Typography variant="h6" className="ml-2">Redireccionando...</Typography>
      </div>
    ),
  });

  return <Component />;
};
