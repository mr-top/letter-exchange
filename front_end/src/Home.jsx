import { useContext, useState, useEffect } from "react";

import { LetterHistoryContext } from "./components/utils/LetterHistoryContext";

import Letters from "./components/Letters";
import Friends from "./components/Friends";
import Converser from "./components/Converser";
import LetterFilter from "./components/LetterFilter";
import Compose from "./components/Compose";

function Home() {
  const { setLookup, setSort, letters, lookup } = useContext(LetterHistoryContext);

  return (
    <div className="flex-1 flex min-h-120 bg-pink-400">
      <div className="flex-1 flex flex-col h-full max-h-120">
        <div className="flex-initial flex h-14">
          <Converser lookup={lookup} />
          <div className="flex-initial flex items-center w-25 bg-blue-700">
            <LetterFilter />
          </div>
          <button className="btn" onClick={()=>document.getElementById('letter_modal').showModal()}>open modal</button>
        </div>
        <div className="flex-1 place-items-center overflow-y-auto grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2 p-2 bg-green-500">
          <Letters letters={letters} />
        </div>
      </div>
      <div className="flex-initial w-50 bg-red-400">
        <button onClick={() => setLookup({ method: 'open' })}>Open Letters</button>
        <ul className="w-full h-fit bg-yellow-400">
          <Friends setLookup={setLookup} />
        </ul>
      </div>
      <Compose/>
    </div>
  )
}

export default Home;