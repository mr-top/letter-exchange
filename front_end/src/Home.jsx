import { useContext } from "react";

import { LetterHistoryContext } from "./components/utils/LetterHistoryContext";

import Letters from "./components/Letters";
import Friends from "./components/Friends";

function Home () {
  const {setLookup, letters} = useContext(LetterHistoryContext);

  return (
    <div className="flex-1 flex min-h-120 bg-pink-400">
      <div className="flex-1 max-h-120 place-items-center overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 p-2 bg-green-500">
        <Letters letters={letters}/>
      </div>
      <div className="flex-initial w-50 bg-red-400">
        <button onClick={() => setLookup({method: 'open'})}>Open Letters</button>
        <ul className="w-full h-fit bg-yellow-400">
          <Friends/>
        </ul>
      </div>
    </div>
  )
}

export default Home;