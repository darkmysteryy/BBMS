import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import socket from "./api/socket";
import { requestAddedRealTime, requestUpdatedRealTime } from "./redux/slices/requestSlice";
import "./index.css";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Connect to websocket when user is logged in
    if (user) {
      socket.connect();

      socket.on("newBloodRequest", (newRequest) => {
        dispatch(requestAddedRealTime(newRequest));
      });

      socket.on("requestAccepted", (updatedRequest) => {
        dispatch(requestUpdatedRealTime(updatedRequest));
      });
    }

    return () => {
      socket.off("newBloodRequest");
      socket.off("requestAccepted");
      socket.disconnect();
    };
  }, [user, dispatch]);

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
