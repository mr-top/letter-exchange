import { useState, useContext } from "react";

import { LetterHistoryContext } from "./components/utils/LetterHistoryContext";
import { UserContext } from "./components/utils/UserContext";

import Letters from "./components/Letters";
import Friends from "./components/Friends";
import Converser from "./components/Converser";
import LetterFilter from "./components/LetterFilter";
import DeleteButton from "./components/DeleteButton";
import Compose from "./components/Compose";

function Home() {
  const [friendsRefresh, setFriendsRefresh] = useState(false);
  const { setLookup, setSort, letters, lookup } = useContext(LetterHistoryContext);
  const {loggedDetails} = useContext(UserContext);

  return (
    <div className="flex-1 flex min-h-120 rounded-sm">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex-initial flex items-center justify-around h-14 border-b-1 border-base-content">
          <Converser lookup={lookup} />
          <div className="flex-initial flex items-center w-35 space-x-2">
            <p>Filter:</p>
            <LetterFilter />
          </div>
          {lookup.method ==='friend' && <button className="btn flex-initial w-35 btn-secondary" onClick={()=>document.getElementById('compose_modal').showModal()}>Send a letter</button>}
          {lookup.newFriend && <DeleteButton setFriendsRefresh={setFriendsRefresh} setLookup={setLookup} lookup={lookup} loggedDetails={loggedDetails}/>}
        </div>
        <div className="flex-1 place-items-center overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 p-2">
          <Letters setLookup={setLookup} lookup={lookup} letters={letters} loggedDetails={loggedDetails}/>
        </div>
      </div>
      <div className="flex-initial flex flex-col items-center w-50 border-l-1 border-base-content space-y-2 p-2">
        <button className='btn btn-neutral' onClick={() => setLookup({ method: 'open', id: loggedDetails.id})}>Open Letters</button>
        <ul className="w-full h-fit overflow-y-auto space-y-2">
          <Friends setLookup={setLookup} friendsRefresh={friendsRefresh}/>
        </ul>
      </div>
      <Compose setLookup={setLookup} lookup={lookup}/>
    </div>
  )
}

export default Home;