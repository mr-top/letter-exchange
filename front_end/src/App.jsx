import { useContext } from "react"

import { UserContext } from './components/utils/UserContext';

import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"

function App() {
  const {loggedDetails} = useContext(UserContext);
  console.log(loggedDetails);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-initial min-h-16 bg-red-400">
        <Navbar/>
      </div>
      <div className="flex-1 min-h-[80vh] bg-blue-400">

      </div>
      <div className="flex-initial min-h-40 bg-yellow-400">
        <Footer/>
      </div>
    </div>
  )
}

export default App
