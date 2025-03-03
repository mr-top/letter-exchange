import { useContext } from "react";
import { Outlet, Navigate} from "react-router-dom";

import { UserContext } from "./UserContext";

function AuthProtected (props) {
  const {children} = props;

  const {loggedDetails} = useContext(UserContext);

  if (loggedDetails.logged) {
    return <Outlet/>
  } else {
    return <Navigate to={'/login'}/>
  }
}

export default AuthProtected;