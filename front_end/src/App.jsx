import { useContext } from "react"
import { Routes, Route, BrowserRouter, Navigate} from "react-router-dom"

import { UserContext } from './components/utils/UserContext';

import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Login from "./components/Login"

function App() {
  const {loggedDetails} = useContext(UserContext);
  console.log(loggedDetails);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-initial bg-red-400">
        <Navbar/>
      </div>
      <div className="flex-1 flex justify-center p-5 items-centermin-h-[80vh] bg-blue-400">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/home" element={<p>Home</p>}/>
            <Route path="*" element={<Navigate to='/home'/>}/>
          </Routes>
        </BrowserRouter>
      </div>
      <div className="flex-initial min-h-40 bg-yellow-400">
        <Footer/>
      </div>
    </div>
  )
}

export default App
