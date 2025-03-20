import { io } from "socket.io-client";
import axios from "axios";
import { create } from "zustand";

const baseUrl =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://chat-app-backend-mu-liard.vercel.app";

export const useSocketStore = create((set, get) => ({
  socket: null, // Store socket in state
  messages: [],
  selectedUser: null,
  code: "",
  input: "",
  userInput: "",
  language: "python",
  output: "",
  allSocketUser: {},
  name: "",
  room: "",
  rooms_user: [],

  connectSocket: () => {
    console.log(get().socket);

    if (!get().socket) {
      // ✅ Prevent multiple connections
      const newSocket = io(baseUrl, {
        withCredentials: true,
        query: { userId: "owais" },
      });

      newSocket.on("connect", (socket) => {
        set({ socket: newSocket });
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
        set({ socket: null });
      });
    }
  },

  setCode: (value) => {
    set({ code: value });
  },

  setUserInput: (value) => {
    set({ userInput: value });
  },

  setLanguage: (value) => {
    set({ language: value });
  },

  setOutput: (value, type) => {
    console.log("type", type);
    set((state) => {
      if (type === "input" || type === "output") {
        return { output: state.output + value + "\n" }; // Append for input type
      }
      return { output: value }; // Overwrite for other cases
    });
  },

  setName: (value) => {
    set({ name: value });
  },

  setRoom: (value) => {
    set({ room: value });
  }
  ,
  setRooms_user: (value) => {
    set({ rooms_user: value });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },
}));
