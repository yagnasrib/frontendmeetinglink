import React, { useState, useEffect } from "react";

const Room = ({ roomId, socket }) => {
  // State to store the list of participants
  const [participants, setParticipants] = useState([]);
  const [isRoomCreated, setIsRoomCreated] = useState(false); // Track room creation status
  const [isLoading, setIsLoading] = useState(false); // Track loading state for room creation

  // Function to create a room
  const createRoom = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch( process.env.REACT_APP_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId }), // Pass the roomId to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to create room");
      }

      const data = await response.json();
      console.log("Room created:", data);
      setIsRoomCreated(true); // Mark the room as created
    } catch (error) {
      console.error("Error creating room:", error);
      alert("Failed to create room. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

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

    // If the room is already created, fetch participants
    if (isRoomCreated) {
      fetchParticipants(); // Call the function to fetch participants
    }

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("update-participants");
    };
  }, [roomId, socket, isRoomCreated]); // Run this effect whenever roomId, socket, or room creation status changes

  // Render the UI
  return (
    <div>
      <h1>Room ID: {roomId}</h1>

      {/* Room Creation Button */}
      {!isRoomCreated ? (
        <div>
          <button onClick={createRoom} disabled={isLoading}>
            {isLoading ? "Creating Room..." : "Create Room"}
          </button>
        </div>
      ) : (
        <>
          {/* Show participants if the room is created */}
          <h2>Participants:</h2>
          <ul>
            {participants.map((participant) => (
              <li key={participant.socketId}>
                {participant.userName} (ID: {participant.socketId})
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Room;
