import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MeetingRoom.css";
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaSignOutAlt,
  FaHandPaper,
  FaShareSquare,
  FaUserPlus,
} from "react-icons/fa";

function MeetingRoom() {
  const navigate = useNavigate();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);

  const videoRef = useRef(null); // Ref for the video element
  const userStreamRef = useRef(null); // Ref for user's media stream

  // Join the meeting and start the camera
  const joinMeeting = () => {
    setHasJoined(true);
    toggleCamera(true); // Automatically turn on the camera when joining
  };

  // Toggle camera on/off
  const toggleCamera = (turnOn = !isCameraOn) => {
    if (turnOn) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraOn(true);
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    } else {
      if (userStreamRef.current) {
        userStreamRef.current.getTracks().forEach((track) => {
          if (track.kind === "video") track.stop(); // Stop only the video track
        });
      }
      setIsCameraOn(false);
    }
  };

  // Toggle microphone on/off
  const toggleMute = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  // Toggle screen sharing
  const toggleScreenShare = () => {
    if (!isScreenSharing) {
      navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          stream.getVideoTracks()[0].onended = () => {
            toggleScreenShare(); // Stop screen sharing when sharing ends
          };
          setIsScreenSharing(true);
        })
        .catch((err) => {
          console.error("Error accessing screen share:", err);
        });
    } else {
      if (userStreamRef.current && videoRef.current) {
        videoRef.current.srcObject = userStreamRef.current; // Switch back to camera stream
      }
      setIsScreenSharing(false);
    }
  };

  // Toggle hand raise
  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
  };

  // Leave the meeting
  const leaveMeeting = () => {
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    alert("You have left the meeting.");
    navigate("/"); // Redirect to home page
  };

  // Add the participate functionality
  const participateMeeting = () => {
    alert("Participating in the meeting!");
    // Add any participation-related functionality here
  };

  return (
    <div className="meeting-room">
      {/* Video Section */}
      {hasJoined ? (
        <div className="video-container">
          <video
            ref={videoRef}
            autoPlay
            muted={isMuted}
            className="video-feed"
          />
        </div>
      ) : (
        <div className="video-placeholder">
          <p>Click 'Join Meet' to start</p>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        {/* Video Icon */}
        <div className="icon" onClick={() => toggleCamera()}>
          {isCameraOn ? <FaVideo size={30} /> : <FaVideoSlash size={30} />}
        </div>

        {/* Microphone Icon */}
        <div className="icon" onClick={toggleMute}>
          {isMuted ? <FaMicrophoneSlash size={30} /> : <FaMicrophone size={30} />}
        </div>

        {/* Participate Icon */}
        <div className="icon" onClick={participateMeeting}>
          <FaUserPlus size={30} />
        </div>

        {/* Hand Raise Icon */}
        <div className="icon" onClick={toggleHandRaise}>
          {isHandRaised ? "Hand Raised" : <FaHandPaper size={30} />}
        </div>

        {/* Screen Share Icon */}
        <div className="icon" onClick={toggleScreenShare}>
          {isScreenSharing ? "Stop Sharing" : <FaShareSquare size={30} />}
        </div>

        {/* Exit Icon */}
        <div className="icon leave-icon exit" onClick={leaveMeeting}>
          <FaSignOutAlt size={30} />
        </div>
      </div>

      {/* Join Meet Button */}
      {!hasJoined && (
        <div className="join-meet-container">
          <button className="join-meet-button" onClick={joinMeeting}>
            Join Meet
          </button>
        </div>
      )}
    </div>
  );
}

export default MeetingRoom;
