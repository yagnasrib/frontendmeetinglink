import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/LandingPage.css";
 
const LandingPage = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
 
  // Retrieve the Room ID from navigation state
  useEffect(() => {
    if (location.state?.roomId) {
      setRoomId(location.state.roomId);
    }
  }, [location.state]);
 
  const joinMeeting = () => {
    if (roomId) {
      alert(`Joining meeting with Room ID: ${roomId}`);
      navigate("/meeting-room", { state: { roomId } }); // Pass Room ID to meeting-room
    } else {
      alert("Please enter a Room ID");
    }
  };
 
  const hostMeeting = () => {
    navigate("/create-meeting"); // Navigate to CreateMeeting page
  };
 
  return (
    <div className="container">
      <h1>Meeting App</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID"
        />
        <button type="button" onClick={joinMeeting}>
          Join Meeting
        </button>
      </form>
      <button onClick={hostMeeting}>Host a Meeting</button>
    </div>
  );
};
 
export default LandingPage;