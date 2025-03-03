import { useState, useEffect } from "react";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

import anonymous from '../assets/anonymous.png';

function Converser ({lookup}) {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchProfile () {
      const result = await axiosFetch(axios.post, '/profile', {id: lookup.id});
      if (result.success) {
        setProfile(result.profile);
      }
    }
    fetchProfile();
  }, [lookup]);

  return (
    <div className="flex-initial flex items-center px-2 w-40 bg-yellow-400">
      <div className="flex-initial rounded-full border-1 border-black size-12 overflow-hidden">
        <img src={profile.pictureUrl || anonymous} alt="profile picture" />
      </div>
      <div className="flex-1">
        <h2>{profile.username}</h2>
      </div>
    </div>
  )
}

export default Converser;