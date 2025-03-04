import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

import anonymous from '../assets/anonymous.png';
import getFlagEmoji from '../utils/getFlagEmoji';

function Profile({id}) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      const result = await axiosFetch(axios.post, '/profile', {id});
      if (result.success) {
        setProfile(result.profile);
      } else {
        navigate('/home');
      }
    }

    fetchProfile();
  }, []);
  
  return (
    <div className="flex-1 flex flex-col items-center min-h-50 bg-pink-400">
      <div className="flex-initial flex space-x-4">
        <div className="flex-initial rounded-full border-1 border-black size-16 overflow-hidden">
          <img src={anonymous} alt="" />
        </div>
        <div className="flex-initial flex items-center">
          <p className="text-xl">{profile.username} {getFlagEmoji(profile.country || 'XX')}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile;