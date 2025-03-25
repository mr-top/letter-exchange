import { useState, useEffect } from "react";

function ProfileWeb() {
  const checkIsDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
  const [theme, setTheme] = useState(localStorage.getItem('theme') || (checkIsDarkSchemePreferred() ? 'dark' : 'light'));

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.querySelector('html').setAttribute('data-theme', theme);
  }, [theme]);

  function changeTheme (e) {
    setTheme(e.target.value);
  }

  return (
    <>
      <div className="flex-initial flex flex-col items-center w-full py-2">
        <p className="text-sm opacity-70">Theme</p>
        <select onChange={changeTheme} value={theme} className="flex-initial select text-sm">
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
        </select>
      </div>
    </>
  )
}

export default ProfileWeb;