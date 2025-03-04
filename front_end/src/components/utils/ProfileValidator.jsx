import { useParams, Navigate } from "react-router-dom";

import Profile from "../Profile";

function ProfileValidator () {
  const { id } = useParams();
  
  if (id && Number(id) > 0) {
    return <Profile id={Number(id)}/>
  } else {
    return <Navigate to={'/home'}/>
  }
}

export default ProfileValidator;