import React, { createContext, useContext, useEffect, useState } from "react";
import { useScreenShare } from "../hooks/useScreenShare";
import { useToast } from "../components/common/ToastContext";

const ScreenShareContext = createContext(null);

export const useScreenShareContext = () => useContext(ScreenShareContext);

export function ScreenShareProvider({ children, socket }) {
  const { showToast } = useToast();
  
  const [isSharing, setIsSharing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const [incomingRequest, setIncomingRequest] = useState(null);
  
  // Peer ID we are connected to (for UI display or stopping)
  const [peerId, setPeerId] = useState(null);
  const [peerSocketId, setPeerSocketId] = useState(null);

  const shareController = useScreenShare(socket);

  // Expose state and functions to the rest of the app
  const contextValue = {
    ...shareController,
    socket,
    isSharing,
    isViewing,
    incomingRequest,
    peerId,
    startShare: async (toUserId) => {
      try {
        await shareController.startDisplayMedia(() => {
          // Triggered when user clicks browser's native "Stop Sharing"
          stopShare();
        });
        socket.emit("screen-share-request", { toUserId });
        setPeerId(toUserId);
        setIsSharing(true);
      } catch (err) {
        showToast("Screen sharing cancelled or failed.", "error");
        setIsSharing(false);
      }
    },
    acceptShare: async () => {
      if (!incomingRequest) return;
      socket.emit("screen-share-accept");
      setPeerId(incomingRequest.fromUser._id);
      setPeerSocketId(incomingRequest.fromSocketId);
      shareController.createPeerConnection(incomingRequest.fromSocketId);
      setIsViewing(true);
      setIncomingRequest(null);
    },
    declineShare: () => {
      socket.emit("screen-share-decline");
      setIncomingRequest(null);
    },
    stopShare: () => {
      socket.emit("screen-share-stop");
      resetState();
    }
  };

  const resetState = () => {
    setIsSharing(false);
    setIsViewing(false);
    setIncomingRequest(null);
    setPeerId(null);
    setPeerSocketId(null);
    shareController.cleanup();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("screen-share-request", (data) => {
      setIncomingRequest(data);
    });

    socket.on("screen-share-accept", async ({ fromSocketId }) => {
      setPeerSocketId(fromSocketId);
      shareController.createPeerConnection(fromSocketId);
      await shareController.sendOffer(fromSocketId);
    });

    socket.on("screen-share-decline", () => {
      showToast("Screen share request declined.", "error");
      resetState();
    });

    socket.on("screen-share-stop", () => {
      showToast("Screen share ended.", "info");
      resetState();
    });

    socket.on("screen-share-offer", async ({ offer, fromSocketId }) => {
      await shareController.handleOffer(offer, fromSocketId);
    });

    socket.on("screen-share-answer", async ({ answer }) => {
      await shareController.handleAnswer(answer);
    });

    socket.on("screen-share-ice", async ({ candidate }) => {
      await shareController.addIceCandidate(candidate);
    });

    socket.on("screen-share-error", ({ message }) => {
      showToast(message, "error");
      resetState();
    });

    return () => {
      socket.off("screen-share-request");
      socket.off("screen-share-accept");
      socket.off("screen-share-decline");
      socket.off("screen-share-stop");
      socket.off("screen-share-offer");
      socket.off("screen-share-answer");
      socket.off("screen-share-ice");
      socket.off("screen-share-error");
    };
  }, [socket, shareController, showToast]);

  return (
    <ScreenShareContext.Provider value={contextValue}>
      {children}
    </ScreenShareContext.Provider>
  );
}
