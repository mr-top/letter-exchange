import { useContext, useState, useEffect } from "react";

import { LetterHistoryContext } from "./utils/LetterHistoryContext";

function LetterFilter() {
  const {setSort, lookup} = useContext(LetterHistoryContext);
  const [selected, setSelected] = useState('all');

  function changeSelected (e) {
    setSelected(e.target.value);
    setSort(prev => {return {...prev, method: e.target.value}});
  }

  useEffect(() => {
    setSelected('all');
  }, [lookup]);

  return (
    <select onChange={changeSelected} value={selected} className="flex-initial select text-sm">
      <option value='all'>All</option>
      <option value='own'>Yours</option>
      <option value='friend'>Theirs</option>
    </select>
  )
}

export default LetterFilter;