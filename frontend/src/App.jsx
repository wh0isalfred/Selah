import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Notes from "./pages/Notes"
import Selah from "./pages/Selah"
import Profile from "./pages/Profile"
import Summary from "./pages/Summary"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/selah" element={<Selah />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/summary" element={<Summary />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App