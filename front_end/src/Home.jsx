import { useContext } from "react";

import { LetterHistoryContext } from "./components/utils/LetterHistoryContext";

import Letters from "./components/Letters";
import Friends from "./components/Friends";
import Converser from "./components/Converser";

function Home () {
  const {setLookup, letters, lookup} = useContext(LetterHistoryContext);

  return (
    <div className="flex-1 flex min-h-120 bg-pink-400">
      <div className="flex-1 flex flex-col h-full max-h-120">
        <div className="flex-initial flex h-14">
          <Converser lookup={lookup}/>
          <div className="flex-1 bg-blue-700">

          </div>
        </div>
        <div className="flex-1 place-items-center overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 p-2 bg-green-500">
          <Letters letters={letters}/>
        </div>
      </div>
      <div className="flex-initial w-50 bg-red-400">
        <button onClick={() => setLookup({method: 'open'})}>Open Letters</button>
        <ul className="w-full h-fit bg-yellow-400">
          <Friends setLookup={setLookup}/>
        </ul>
      </div>
    </div>
  )
}

export default Home;