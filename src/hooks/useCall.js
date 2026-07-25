import { useState, useEffect, useCallback, useRef } from "react";
import { useWebRTC } from "./useWebRTC";
import { useToast } from "../components/common/ToastContext";

export function useCall(socket, currentUser) {
  const { showToast } = useToast();
  
  const [callState, setCallState] = useState("idle"); // "idle" | "dialing" | "ringing" | "connected"
  const [callType, setCallType] = useState("audio"); // "audio" | "video"
  const [peerUser, setPeerUser] = useState(null);
  const [peerSocketId, setPeerSocketId] = useState(null);
  const [callError, setCallError] = useState("");

  const {
    localStream,
    remoteStream,
    connectionState,
    startLocalStream,
    stopLocalStream,
    createPeerConnection,
    closePeerConnection,
    sendWebRTCOffer,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    addIceCandidate
  } = useWebRTC(socket);

  const peerSocketIdRef = useRef(null);
  useEffect(() => {
    peerSocketIdRef.current = peerSocketId;
  }, [peerSocketId]);

  const initiateCall = useCallback(async (toCallId, type) => {
    try {
      setCallError("");
      setCallType(type);
      setCallState("dialing");
      
      const hasVideo = type === "video";
      await startLocalStream(hasVideo, true);

      socket.emit("call_user", { toCallId, type });
    } catch (err) {
      setCallState("idle");
      setCallError("Could not access camera/microphone.");
      showToast("Media permission denied", "error");
    }
  }, [socket, startLocalStream, showToast]);

  const acceptCall = useCallback(async () => {
    if (!peerSocketIdRef.current) return;

    try {
      const hasVideo = callType === "video";
      await startLocalStream(hasVideo, true);

      createPeerConnection(peerSocketIdRef.current);
      socket.emit("accept_call");
      setCallState("connected");
    } catch (err) {
      socket.emit("reject_call");
      setCallState("idle");
      stopLocalStream();
      showToast("Failed to accept call: check permissions", "error");
    }
  }, [callType, startLocalStream, createPeerConnection, socket, stopLocalStream, showToast]);

  const rejectCall = useCallback(() => {
    socket.emit("reject_call");
    setCallState("idle");
    setPeerUser(null);
    setPeerSocketId(null);
  }, [socket]);

  const cancelCall = useCallback(() => {
    socket.emit("cancel_call");
    setCallState("idle");
    setPeerUser(null);
    setPeerSocketId(null);
    closePeerConnection();
  }, [socket, closePeerConnection]);

  const hangUp = useCallback(() => {
    socket.emit("end_call");
    setCallState("idle");
    setPeerUser(null);
    setPeerSocketId(null);
    closePeerConnection();
  }, [socket, closePeerConnection]);

  useEffect(() => {
    if (!socket) return;

    socket.on("incoming_call", ({ fromUser, type, fromSocketId }) => {
      setPeerUser(fromUser);
      setCallType(type);
      setPeerSocketId(fromSocketId);
      setCallState("ringing");

      // Trigger system notification
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        const notif = new Notification(`Incoming Call`, {
          body: `Incoming ${type} call from ${fromUser.name || fromUser.username}`,
          requireInteraction: true
        });
        notif.onclick = () => {
          window.focus();
          notif.close();
        };
      }
    });

    socket.on("call_ringing", ({ toUser }) => {
      setPeerUser(toUser);
    });

    socket.on("call_accepted", async ({ fromSocketId }) => {
      setPeerSocketId(fromSocketId);
      setCallState("connected");
      createPeerConnection(fromSocketId);
      await sendWebRTCOffer(fromSocketId);
    });

    socket.on("call_rejected", () => {
      setCallState("idle");
      setCallError("Call rejected by peer");
      closePeerConnection();
      showToast("Call rejected", "error");
    });

    socket.on("call_cancelled", () => {
      setCallState("idle");
      setPeerUser(null);
      setPeerSocketId(null);
      closePeerConnection();
      showToast("Call cancelled by caller", "info");
    });

    socket.on("call_error", ({ message }) => {
      setCallState("idle");
      setCallError(message);
      closePeerConnection();
      showToast(message, "error");
    });

    socket.on("call_ended", () => {
      setCallState("idle");
      setPeerUser(null);
      setPeerSocketId(null);
      closePeerConnection();
      showToast("Call ended", "info");
    });

    socket.on("webrtc_offer", async ({ offer, fromSocketId }) => {
      await handleWebRTCOffer(offer, fromSocketId);
    });

    socket.on("webrtc_answer", async ({ answer }) => {
      await handleWebRTCAnswer(answer);
    });

    socket.on("ice_candidate", async ({ candidate }) => {
      await addIceCandidate(candidate);
    });

    return () => {
      socket.off("incoming_call");
      socket.off("call_ringing");
      socket.off("call_accepted");
      socket.off("call_rejected");
      socket.off("call_cancelled");
      socket.off("call_error");
      socket.off("call_ended");
      socket.off("webrtc_offer");
      socket.off("webrtc_answer");
      socket.off("ice_candidate");
    };
  }, [
    socket,
    createPeerConnection,
    sendWebRTCOffer,
    handleWebRTCOffer,
    handleWebRTCAnswer,
    addIceCandidate,
    closePeerConnection,
    showToast
  ]);

  return {
    callState,
    callType,
    peerUser,
    localStream,
    remoteStream,
    connectionState,
    callError,
    isDialing: callState === "dialing",
    initiateCall,
    acceptCall,
    rejectCall,
    cancelCall,
    hangUp,
  };
}
