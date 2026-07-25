export const iceServersConfig = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    // Coturn TURN credentials can be appended here later for production NAT traversal
  ],
};
