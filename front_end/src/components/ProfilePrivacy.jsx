import { useContext, useState, useEffect } from 'react';

import BlockedUsers from './BlockedUsers';

import { UserContext } from './utils/UserContext';

import axios from 'axios';
import axiosFetch from '../utils/axiosFetch';

function ProfilePrivacy() {
  const { loggedDetails } = useContext(UserContext);
  const [profile, setProfile] = useState({});
  const [acceptingLetters, setAcceptingLetters] = useState(true);
  const [acceptingFriends, setAcceptingFriends] = useState(true);
  const [usersToRemove, setUsersToRemove] = useState([]);
  const [changeStatus, setChangeStatus] = useState({ lettersAcceptChanged: false, friendsAcceptChanged: false, blockedListChanged: false });
  const [error, setError] = useState({});

  useEffect(() => {
    async function fetchProfile() {
      const result = await axiosFetch(axios.post, '/profile', { id: loggedDetails.id });

      if (result.success) {
        setProfile(result.profile);
      }
    }

    fetchProfile();

    document.getElementById('accept_letters_id').addEventListener('click', () => {
      setChangeStatus(prev => { return { ...prev, lettersAcceptChanged: true } });
    });
    document.getElementById('accept_friends_id').addEventListener('click', () => {
      setChangeStatus(prev => { return { ...prev, friendsAcceptChanged: true } });
    });
  }, []);

  useEffect(() => {
    setAcceptingLetters(!!profile.accepting_letters);
    setAcceptingFriends(!!profile.accepting_friends);
  }, [profile]);

  async function save() {
    const somethingChanged = Object.values(changeStatus).some(status => status);

    if (somethingChanged) {
      const result = await axiosFetch(axios.post, '/saveprivacy', {id: loggedDetails.id, changeStatus, acceptingFriends, acceptingLetters, usersToRemove});
      if (result.success) {
        setError({});

        if (result.usersRemoved) {
          setUsersToRemove([]);
        }

        for (let status in changeStatus) {
          setChangeStatus(prev => {
            prev[status] = false;
            return prev;
          });
        }

        if (result.errorList?.length > 0) {
          setError(prev => {return {...prev, someChangeError: true}});
          
          for (let idx = 0; idx < result.errorList.length; idx++) {
            const currentError = result.errorList[idx];
            switch (currentError[0]) {
              case 'toggleLetters':
                setChangeStatus(prev => {return {...prev, lettersAcceptChanged: true}});
                setError(prev => {return {...prev, lettersAcceptError: true}});
                break;
              case 'toggleFriends':
                setChangeStatus(prev => {return {...prev, friendsAcceptChanged: true}});
                setError(prev => {return {...prev, friendsAcceptError: true}});
                break;
              case 'blockList':
                setChangeStatus(prev => {return {...prev, blockedListChanged: true}});
                setError(prev => {return {...prev, blockListError: true}});
                break;
            }
          }
        }
      }

    } else {
      // no changes were made
      setError(prev => { return { ...prev, noChangeError: true }});
    }
  }

  return (
    <>
      <div>
        <label className="text-sm opacity-70">Accepting new letters {error.lettersAcceptError && '(Error occured)'}</label>
        <div className='flex items-center space-x-2'>
          <label className="toggle text-base-content">
            <input id='accept_letters_id' type="checkbox" checked={acceptingLetters} onClick={() => setAcceptingLetters(prev => !prev)} readOnly />
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g></svg>
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm opacity-70">Accepting new friends {error.friendsAcceptError && '(Error occured)'}</label>
        <div className='flex items-center space-x-2'>
          <label className="toggle text-base-content">
            <input id='accept_friends_id' type="checkbox" checked={acceptingFriends} onClick={() => setAcceptingFriends(prev => !prev)} readOnly />
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g></svg>
          </label>
        </div>
      </div>

      <div>
        <label className='text-sm opacity-70'>Blocked users {error.blockListError && '(Error occured)'}</label>
        <div className='w-50 h-40 border-base-content border-1 rounded-md overflow-y-auto space-y-2'>
          <BlockedUsers id={loggedDetails.id} setChangeStatus={setChangeStatus} usersToRemove={usersToRemove} setUsersToRemove={setUsersToRemove} />
        </div>
      </div>

      {error.noChangeError && <p className="text-sm opacity-70">Nothing has been changed</p>}
      {error.someChangeError && <p className="text-sm opacity-70">Only some changes were saved</p>}

      <input onClick={save} type="button" value={'Save Changes'} className="btn btn-accent" />

      <input type="button" value={'Delete Account'} className="btn btn-error" />
    </>
  )
}

export default ProfilePrivacy;