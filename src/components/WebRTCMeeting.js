import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/WebRTCMeeting.css";

const socket = io(`${process.env.REACT_APP_API_URL}`); // Connect to the server

const WebRTCMeeting = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [localStream, setLocalStream] = useState(null);
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages

  const servers = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }], // Public STUN server
  };

  // Join room on component mount
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to signaling server");
    });

    socket.on("userJoined", (message) => {
      console.log(message);
    });

    socket.on("userLeft", (message) => {
      console.log(message);
    });

    socket.on("roomFull", (message) => {
      setErrorMessage(message); // Display error message if room is full
    });

    socket.on("meetingExpired", (message) => {
      setErrorMessage(message); // Display error message if meeting has expired
      // Optionally end the call or redirect
      endCall();
    });

    socket.on("offer", async (offer) => {
      const connection = new RTCPeerConnection(servers);
      connection.setRemoteDescription(new RTCSessionDescription(offer));

      // Add tracks from the local stream
      localStream.getTracks().forEach((track) => {
        connection.addTrack(track, localStream);
      });

      // Create an answer and send it back to the offerer
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      socket.emit("answer", answer, roomId);

      connection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate, roomId);
        }
      };

      setPeerConnection(connection);
    });

    socket.on("answer", (answer) => {
      peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("ice-candidate", (candidate) => {
      peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("roomFull");
      socket.off("meetingExpired");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;
      setLocalStream(stream);

      const connection = new RTCPeerConnection(servers);
      stream.getTracks().forEach((track) => {
        connection.addTrack(track, stream);
      });

      connection.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      connection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", event.candidate, roomId);
        }
      };

      setPeerConnection(connection);

      // Join room and notify backend
      socket.emit("joinRoom", roomId);

      // Create an offer and send it to the room
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    socket.emit("leaveRoom", roomId); // Notify server that user is leaving
  };

  return (
    <div className="webrtc-container">
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <button onClick={startCall}>Start Call</button>
      {errorMessage && <div className="error-message">{errorMessage}</div>} {/* Show error message */}
      <div className="video-container">
        <video ref={localVideoRef} autoPlay muted playsInline />
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={endCall}>End Call</button>
    </div>
  );
};

export default WebRTCMeeting;
