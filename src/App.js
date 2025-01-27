import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "../src/components/signup"; // Capitalized component name
import SignIn from "../src/components/signin"; // Capitalized component name
import LandingPage from "../src/components/LandingPage";
import CreateMeeting from "../src/components/CreateMeeting";
import MeetingRoom from "../src/components/MeetingRoom";
import WebRTCMeeting from "../src/components/WebRTCMeeting";
import Socket from './components/socket'; // Capitalized component name

const App = () => {
  console.log("App component is rendering");
  return (
    <Router>
      <Routes>
      
      <Route path="/" element={<LandingPage />} /> {/* Set LandingPage to be the default home page */}
        <Route path="/signup" element={<SignUp />} /> {/* Corrected component name */}
        <Route path="/signin" element={<SignIn />} /> {/* Corrected component name */}
        <Route path="/create-meeting" element={<CreateMeeting />} />
        <Route path="/meeting-room" element={<MeetingRoom />} />
        <Route path="/web-rtc-meeting" element={<WebRTCMeeting />} />
        <Route path="/socket" element={<Socket />} />
      </Routes>
    </Router>
  );
};

export default App;
