import { useState, useRef, useCallback, useEffect } from "react";
import { iceServersConfig } from "../config/webrtc";

export function useScreenShare(socket) {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState("idle");
  const [error, setError] = useState("");

  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const cleanup = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.onicecandidate = null;
      peerConnectionRef.current.ontrack = null;
      peerConnectionRef.current.onconnectionstatechange = null;
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }
    setLocalStream(null);
    setRemoteStream(null);
    setConnectionState("idle");
    setError("");
  }, []);

  const createPeerConnection = useCallback((recipientSocketId) => {
    if (peerConnectionRef.current) {
      cleanup();
    }

    const pc = new RTCPeerConnection(iceServersConfig);
    peerConnectionRef.current = pc;

    pc.onconnectionstatechange = () => {
      setConnectionState(pc.connectionState);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && recipientSocketId) {
        socket.emit("screen-share-ice", {
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
  }, [socket, cleanup]);

  const startDisplayMedia = useCallback(async (onEndedCallback) => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      
      // Listen for the browser's native "Stop sharing" button
      stream.getVideoTracks()[0].onended = () => {
        if (onEndedCallback) onEndedCallback();
      };

      localStreamRef.current = stream;
      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("useScreenShare: Failed to get display media", err);
      setError("Failed to capture screen. Permission denied or unsupported.");
      throw err;
    }
  }, []);

  const sendOffer = useCallback(async (recipientSocketId) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("screen-share-offer", {
        offer,
        toSocketId: recipientSocketId,
      });
    } catch (err) {
      console.error("useScreenShare: Error creating SDP offer", err);
      setError("Error establishing connection.");
    }
  }, [socket]);

  const handleOffer = useCallback(async (offer, senderSocketId) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit("screen-share-answer", {
        answer,
        toSocketId: senderSocketId,
      });
    } catch (err) {
      console.error("useScreenShare: Error setting offer or creating answer", err);
    }
  }, [socket]);

  const handleAnswer = useCallback(async (answer) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error("useScreenShare: Error setting remote answer", err);
    }
  }, []);

  const addIceCandidate = useCallback(async (candidate) => {
    try {
      const pc = peerConnectionRef.current;
      if (!pc) return;

      await pc.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.error("useScreenShare: Error adding ICE candidate", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    localStream,
    remoteStream,
    connectionState,
    error,
    startDisplayMedia,
    createPeerConnection,
    sendOffer,
    handleOffer,
    handleAnswer,
    addIceCandidate,
    cleanup,
  };
}
