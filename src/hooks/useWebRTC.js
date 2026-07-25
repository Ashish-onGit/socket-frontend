import { useEffect, useRef, useState, useCallback } from "react";
import { iceServersConfig } from "../config/webrtc";

export function useWebRTC(socket) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState("new");

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const toggleAudio = useCallback((enabled) => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }, []);

  const toggleVideo = useCallback((enabled) => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = enabled;
      });
    }
  }, []);

  const stopAllStreams = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
      setLocalStream(null);
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
      setRemoteStream(null);
    }
  }, []);

  const startLocalStream = useCallback(async (videoEnabled = true, audioEnabled = true) => {
    try {
      stopAllStreams();
      const constraints = {
        video: videoEnabled
          ? { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
          : false,
        audio: audioEnabled,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("useWebRTC: Failed to get local stream", err);
      throw err;
    }
  }, [stopAllStreams]);

  const closePeerConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    stopAllStreams();
    setConnectionState("closed");
  }, [stopAllStreams]);

  const createPeerConnection = useCallback((recipientSocketId) => {
    if (peerConnectionRef.current) {
      closePeerConnection();
    }

    const pc = new RTCPeerConnection(iceServersConfig);
    peerConnectionRef.current = pc;

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && recipientSocketId) {
        socket.emit("ice_candidate", {
          candidate: event.candidate,
          toSocketId: recipientSocketId,
        });
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteStreamRef.current = event.streams[0];
        setRemoteStream(event.streams[0]);
      } else {
        if (!remoteStreamRef.current) {
          remoteStreamRef.current = new MediaStream();
          setRemoteStream(remoteStreamRef.current);
        }
        remoteStreamRef.current.addTrack(event.track);
      }
    };

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    return pc;
  }, [socket, closePeerConnection]);

  const sendWebRTCOffer = useCallback(async (recipientSocketId) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("webrtc_offer", {
        offer,
        toSocketId: recipientSocketId,
      });
    } catch (err) {
      console.error("useWebRTC: Error creating SDP offer", err);
    }
  }, [socket]);

  const handleWebRTCOffer = useCallback(async (offer, senderSocketId) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("webrtc_answer", {
        answer,
        toSocketId: senderSocketId,
      });
    } catch (err) {
      console.error("useWebRTC: Error setting offer or creating answer", err);
    }
  }, [socket]);

  const handleWebRTCAnswer = useCallback(async (answer) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error("useWebRTC: Error setting remote answer", err);
    }
  }, []);

  const addIceCandidate = useCallback(async (candidate) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("useWebRTC: Error adding ICE candidate", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      closePeerConnection();
    };
  }, [closePeerConnection]);

  return {
    localStream,
    remoteStream,
    connectionState,
    startLocalStream,
    stopLocalStream: stopAllStreams,
    createPeerConnection,
    closePeerConnection,
    toggleAudio,
    toggleVideo,
    sendWebRTCOffer,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    addIceCandidate,
  };
}
