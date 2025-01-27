import React, { useState, useEffect } from "react";

const Room = ({ roomId, socket }) => {
  // State to store the list of participants
  const [participants, setParticipants] = useState([]);

  // useEffect to handle real-time updates and fetch initial data
  useEffect(() => {
    // Listen for real-time updates from the server
    socket.on("update-participants", (updatedParticipants) => {
      setParticipants(updatedParticipants); // Update the state
    });

    // Fetch the initial list of participants when the component loads
    const fetchParticipants = async () => {
      try {
        const response = await fetch(`/api/rooms/${roomId}/participants`); // Fetch from your backend
        if (response.ok) {
          const data = await response.json(); // Convert response to JSON
          setParticipants(data); // Update the state with participants
        } else {
          console.error("Failed to fetch participants:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    };

    fetchParticipants(); // Call the function to fetch participants

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("update-participants");
    };
  }, [roomId, socket]); // Run this effect whenever roomId or socket changes

  // Render the list of participants
  return (
    <div>
      <h1>Room ID: {roomId}</h1>
      <h2>Participants:</h2>
      <ul>
        {participants.map((participant) => (
          <li key={participant.socketId}>
            {participant.userName} (ID: {participant.socketId})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Room;
