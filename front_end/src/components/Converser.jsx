import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

import anonymous from '../assets/anonymous.png';

function Converser ({lookup}) {
  const navigate = useNavigate();
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
    <div className="flex-initial flex justify-around items-center px-2 w-50">
      <div className="flex-initial rounded-full border-1 border-black size-12 overflow-hidden">
        <img src={anonymous} alt="profile picture" />
      </div>
      <div className="flex-initial">
        <h2 className="text-lg link" onClick={() => navigate(`/profile/${profile.id}`)}>{profile?.username}</h2>
      </div>
    </div>
  )
}

export default Converser;