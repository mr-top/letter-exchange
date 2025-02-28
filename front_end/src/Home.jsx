import { useContext } from "react";

import { LetterHistoryContext } from "./components/utils/LetterHistoryContext";

function Home () {
  const {setLookup, letters} = useContext(LetterHistoryContext);

  return (
    <div className="flex-1 flex min-h-120 bg-pink-400">
      <div className="flex-1 bg-green-500">
        
      </div>
      <div className="flex-initial w-50 bg-red-400">
        <button onClick={() => setLookup({method: 'open'})}>Open Letters</button>
        <ul className="w-full h-full bg-yellow-400">
          
        </ul>
      </div>
    </div>
  )
}

export default Home;