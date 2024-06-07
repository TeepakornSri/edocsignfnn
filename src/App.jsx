import { ToastContainer } from "react-toastify";
import Route from "./router/Routes"
import { useAuth } from "./hooks/use-auth";
import Loading from "./components/Loading";
import "./App.css";

function App() {
  const { initialLoading } = useAuth();
  console.log(initialLoading);
  return (
    <>
      {initialLoading ? (
        <Loading />
      ) : (
        <>
          <Route />
          <ToastContainer />
        </>
      )}
    </>
  );
}

export default App;
