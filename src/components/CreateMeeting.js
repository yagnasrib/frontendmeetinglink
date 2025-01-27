import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/CreateMeeting.css";

const CreateMeeting = () => {
  const [title, setTitle] = useState(""); // Store title input
  const [hostName, setHostName] = useState(""); // Store host name input
  const navigate = useNavigate();

  const generateRoomID = async () => {
    const id = "ROOM-" + Math.random().toString(36).substring(2, 10).toUpperCase();
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000"; // Fallback for API URL

    // Debugging logs
    console.log("Generated Room ID:", id);
    console.log("Title:", title);
    console.log("Host Name:", hostName);
    console.log("API URL:", apiUrl);

    try {
      // Send POST request to backend to create meeting
      const response = await axios.post(`${apiUrl}/api/meetings/create`, {
        roomId: id,
        title: title,
        hostName: hostName,
      });

      if (response.status === 201) {
        console.log("Meeting created successfully:", response.data);
        // Navigate to the homepage and pass the roomId as state
        navigate("/", { state: { roomId: id } });
      } else {
        console.error("Unexpected response:", response);
        alert("Failed to create meeting. Please try again.");
      }
    } catch (error) {
      // Enhanced error handling
      console.error("Error creating meeting:", error);
      if (error.response) {
        console.error("Backend response:", error.response.data);
        alert(`Error: ${error.response.data.message || "Failed to create meeting."}`);
      } else {
        alert("Failed to create meeting. Check your network connection and try again.");
      }
    }
  };

  return (
    <div className="container">
      <h1>Create a Meeting</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter Meeting Title"
      />
      <input
        type="text"
        value={hostName}
        onChange={(e) => setHostName(e.target.value)}
        placeholder="Enter Host Name"
      />
      <button className="btn" onClick={generateRoomID}>
        Generate Room ID
      </button>
    </div>
  );
};

export default CreateMeeting;
