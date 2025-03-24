import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "./utils/UserContext";

import axios from "axios";
import axiosFetch from "../utils/axiosFetch";

import getGeo from "../utils/getGeo";
import anonymous from '../assets/anonymous.png';

function ProfileGeneral() {
  const navigate = useNavigate();
  const { loggedDetails } = useContext(UserContext);
  const [quote, setQuote] = useState('');
  const [profile, setProfile] = useState({});
  const [changeStatus, setChangeStatus] = useState({quoteChanged: false, locationChanged: false});

  useEffect(() => {
    const keyPressed = () => {
      setChangeStatus(prev => {return {...prev, quoteChanged: true}});
      document.getElementById('quote_id').removeEventListener('keypress', keyPressed);
      return () => {
        console.log('event removed');
      }
    }
    document.getElementById('quote_id').addEventListener('keypress', keyPressed)

    async function fetchProfile () {
      const result = await axiosFetch(axios.post, '/profile', {id: loggedDetails.id});

      if (result.success) {
        setProfile(result.profile);
      }
    }

    fetchProfile();
  }, []);

  useEffect(() => {
    setQuote(profile.description);
  }, [profile]);

  useEffect(() => {
    profile.description = quote;
    
  }, [quote])

  async function updateLocation() {
    const geo = await getGeo();

    if (geo.status === 'success') {
      profile.latitude = geo.lat;
      profile.longitude = geo.lon;
      profile.country = geo.countryCode;
      profile.city = geo.city;

      setChangeStatus(prev => {return {...prev, locationChanged: true}});
    }
  }

  async function save() {
    const somethingChanged = Object.values(changeStatus).some(status => status);
    
    if (somethingChanged) {
      const result = await axiosFetch(axios.post, '/save', {changeStatus, profile});
      if (result.success) {
        navigate(0);
      }
    } else {
      // no changes were made
    }
  }

  return (
    <>
      <div className="size-18 border-1 border-base-content rounded-full overflow-hidden">
        <img src={anonymous} alt="user profile picture" />
      </div>

      <div>
        <label className="text-sm opacity-70">Username</label>
        <input type="text" value={profile.username || ''} className="input" disabled={true} />
      </div>

      <div>
        <label className="text-sm opacity-70">Quote</label>
        <textarea id='quote_id' type="text" value={quote || ''} onChange={e => setQuote(e.currentTarget.value)} className="textarea h-20" />
      </div>

      <div>
        <label className="text-sm opacity-70">Location</label>
        <div className="flex space-x-2">
          <input type="text" value={`${profile.country}, ${profile.city}`} className="flex-1 input" disabled={true}/>
          <input onClick={updateLocation} type="button" value={'Update Location'} className="flex-initial btn" />
        </div>
      </div>

      <input onClick={save} type="button" value={'Save Changes'} className="btn btn-accent" />
    </>
  )
}

export default ProfileGeneral;