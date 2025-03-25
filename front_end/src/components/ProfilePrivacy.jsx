import { useContext, useState, useEffect } from 'react';

import BlockedUsers from './BlockedUsers';

import { UserContext } from './utils/UserContext';

function ProfilePrivacy() {
  const { loggedDetails } = useContext(UserContext);
  const [acceptingLetters, setAcceptingLetters] = useState(true);
  const [acceptingFriends, setAcceptingFriends] = useState(true);

  function save () {

  }

  return (
    <>
      <div>
        <label className="text-sm opacity-70">Accepting new letters</label>
        <div className='flex items-center space-x-2'>
          <label className="toggle text-base-content">
            <input type="checkbox" defaultChecked={acceptingLetters} onChange={() => setAcceptingLetters(prev => !prev)} />
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g></svg>
          </label>
        </div>
      </div>

      <div>
        <label className="text-sm opacity-70">Accepting new friends</label>
        <div className='flex items-center space-x-2'>
          <label className="toggle text-base-content">
            <input type="checkbox" defaultChecked={acceptingLetters} onChange={() => setAcceptingFriends(prev => !prev)} />
            <svg aria-label="enabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
            <svg aria-label="disabled" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="4" fill="none" stroke="currentColor"><path d="M20 6 9 17l-5-5"></path></g></svg>
          </label>
        </div>
      </div>

      <div>
        <label className='text-sm opacity-70'>Blocked users</label>
        <div className='w-50 h-40 border-base-content border-1 rounded-md overflow-y-auto space-y-2'>
          <BlockedUsers id={loggedDetails.id}/>
        </div>
      </div>

      <input onClick={save} type="button" value={'Save Changes'} className="btn btn-accent" />

      <input type="button" value={'Delete Account'} className="btn btn-error" />
    </>
  )
}

export default ProfilePrivacy;