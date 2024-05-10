import { Provider } from "react-redux";
import Rutas from "./routes/Routes";
import { store } from "./redux/store/store";

function App() {


  return (

    <Provider store={store}>
    <Rutas />
  </Provider>
  
  );
}

export default App
