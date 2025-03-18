import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";

import Profile from "../Profile";

import { UserContext } from "./UserContext";

function ProfileValidator () {
  const { loggedDetails } = useContext(UserContext);
  const { id } = useParams();
  
  if (id && Number(id) > 0) {
    return <Profile id={Number(id)} ownProfile={loggedDetails.id === Number(id)}/>
  } else {
    return <Navigate to={'/home'}/>
  }
}

export default ProfileValidator;