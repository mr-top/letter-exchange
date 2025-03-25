import { useState } from "react";

import ProfilePrivacy from "./ProfilePrivacy";
import ProfileGeneral from "./ProfileGeneral";
import ProfileWeb from "./ProfileWeb";

function ProfileSettings() {
  const [currentTab, setCurrentTab] = useState('g');

  return (
    <div className="flex justify-center min-h-140 w-full p-4">
      <div className="flex-initial flex flex-col h-full min-w-100 w-120 border-1 border-base-content">
        <div role="tablist" className="flex-initial flex w-full tabs tabs-lift">
          <a role="tab" className={`flex-1 tab ${currentTab === 'p' && 'tab-active'}`} onClick={() => setCurrentTab('p')}>Privacy</a>
          <a role="tab" className={`flex-1 tab ${currentTab === 'g' && 'tab-active'}`} onClick={() => setCurrentTab('g')}>General</a>
          <a role="tab" className={`flex-1 tab ${currentTab === 'w' && 'tab-active'}`} onClick={() => setCurrentTab('w')}>Web</a>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center space-y-3 w-full">
          {currentTab === 'p' && <ProfilePrivacy/>}
          {currentTab === 'g' && <ProfileGeneral/>}
          {currentTab === 'w' && <ProfileWeb/>}
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings;