import { createContext, useState, useContext, useEffect } from "react";

const SitePingContext = createContext();

import { UserContext } from "./UserContext";

import axios from "axios";
import axiosFetch from "../../utils/axiosFetch";

function SitePingProvider (props) {
  const [connected, setConnected] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const { loggedDetails, attemptLogout } = useContext(UserContext);

  function forceRefresh() {
    window.location.reload();
  }

  useEffect(() => {
    const countdownId = setInterval(() => {
      setCountdown(prev => prev - 1);
    }, 1000);

    async function pingServer () {
      const result = await axiosFetch(axios.post, '/ping', {id: loggedDetails.id});
      if (result.success) {
        console.log('Connected');
        setConnected(true);
        clearInterval(countdownId);
        setCountdown(10);
      }

      if (result.forceLogout) {
        console.log('Had to log you out');
        attemptLogout();
      }
    }

    pingServer();
  }, []);

  useEffect(() => {
    if (countdown <= 0) {
      forceRefresh();
    }
  }, [countdown])

  return (
    <SitePingContext.Provider value={{countdown, connected, forceRefresh}}>
      {props.children}
    </SitePingContext.Provider>
  )
}

export {SitePingContext, SitePingProvider}