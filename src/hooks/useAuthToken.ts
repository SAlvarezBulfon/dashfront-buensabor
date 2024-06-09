import { useAuth0 } from "@auth0/auth0-react";

const useAuthToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        },
      });
      return token;
    } catch (error) {
      console.error("Error fetching access token", error);
      throw error;
    }
  };

  return getToken;
};

export default useAuthToken;
