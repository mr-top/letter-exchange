import { useContext } from "react"
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom"

import { SitePingContext } from "./components/utils/SitePingProvider";

import Home from "./Home";
import ProfileValidator from "./components/utils/ProfileValidator";
import Footer from "./components/footer/Footer"
import Navbar from "./components/navbar/Navbar"
import Login from "./components/Login"
import Register from "./components/Register";
import AuthProtected from "./components/utils/AuthProtected";
import ProfileSettings from "./components/ProfileSettings";
import Intro from './components/Intro';

function App() {
  const { countdown, connected, forceRefresh } = useContext(SitePingContext);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {connected || 
        <div>
          <p>Connection not established! Refreshing page in {countdown} <button className='btn' onClick={forceRefresh}>Refresh now</button></p>
        </div>}
        <div className="flex-initial">
          <Navbar />
        </div>
        <div className="flex-1 flex justify-center p-2">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AuthProtected/>}>
              <Route path="/home" element={<Home/>} />
              <Route path="/profile/settings" element={<ProfileSettings/>}></Route>
              <Route path="/profile" element={<ProfileValidator/>}/>
              <Route path="/profile/:id" element={<ProfileValidator/>}/>
            </Route>
            <Route path="*" element={<Intro/>} />
          </Routes>
        </div>
        <div className="flex-initial min-h-40">
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
