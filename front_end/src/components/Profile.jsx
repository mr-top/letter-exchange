import { useContext, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import Compose from "./Compose";
import Report from "./Report";
import Block from "./Block";

import { LetterHistoryContext } from "./utils/LetterHistoryContext";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

import anonymous from '../assets/anonymous.png';
import getFlagEmoji from '../utils/getFlagEmoji';
import ProfileStat from "./ProfileStat";

function Profile({ id, ownProfile }) {
  const { lookup, setLookup } = useContext(LetterHistoryContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      const result = await axiosFetch(axios.post, '/profile', { id });
      if (result.success) {
        setProfile(result.profile);

        if (!ownProfile) {
          setLookup({ method: 'friend', id: result.profile.id });
        }
      } else {
        navigate('/home');
      }
    }

    fetchProfile();
  }, [id]);

  return (
    <div className="flex justify-center min-h-120 w-full p-4">
      <div className="flex-initial flex flex-col h-full w-80 border-1 border-base-content">
        <div className="flex-1/6 flex h-20 w-full pt-5">
          <div className="flex-1/3 flex justify-end items-center h-full">
            <div className="flex-initial size-18 rounded-full overflow-hidden border-1 border-base-content">
              <img src={profile.pictureUrl || anonymous} alt="" />
            </div>
          </div>
          <div className="flex-2/3 flex justify-start items-center h-full px-6">
            <h2 className="text-2xl">{profile.username} {getFlagEmoji(profile.country || 'XX')}</h2>
          </div>
        </div>
        <div className="flex-1/6 flex justify-center items-center">
          <p className="text-lg">"{profile.quote || 'No quote provided'}"</p>
        </div>
        <div className="flex-3/6 flex justify-center items-center">
          <ProfileStat profile={profile} />
        </div>
        <div className="flex-1/6 flex justify-center items-center px-4 space-x-2">
          {ownProfile ?
            <>
              <Link to='/profile/settings'><button className="btn btn-accent">Settings</button></Link>
            </> :
            <>
              <button className="flex-4/6 btn btn-accent" onClick={() => document.getElementById('compose_modal').showModal()}>Compose a letter</button>
              <Compose lookup={lookup} setLookup={setLookup} />
              <button className="flex-1/6 btn btn-warning text-xs" onClick={() => document.getElementById('report_modal').showModal()}>Report</button>
              <Report profile={profile}/>
              <button className="flex-1/6 btn btn-error text-xs" onClick={() => document.getElementById('block_modal').showModal()}>Block</button>
              <Block profile={profile}/>
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Profile;