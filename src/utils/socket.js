// utils/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("whiteboard_user_token");

const socket = io("http://localhost:5000", {
  withCredentials: true,
  extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
});

export default socket;
