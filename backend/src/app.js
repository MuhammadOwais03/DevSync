import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import { spawn } from "child_process";

const app = express();
const __dirname = path.resolve();
const server = http.createServer(app);

const allowedOrigins = ["http://localhost:5173"];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const newSocketUser = {};

export const getUserSocketId = (userId) => {
  return newSocketUser[userId];
};

const room_info = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("Client connected:", socket.id, userId);

  newSocketUser[socket.id] = userId;

  let runningProcess = null;

  socket.on("runCode", ({ code, language, room }) => {
    if (runningProcess) runningProcess.kill();

    let command, args;
    if (language === "python") {
      command = "python3";
      args = ["-u", "-c", code]; // -u ensures unbuffered output
    } else if (language === "javascript") {
      command = "node";
      args = ["-e", code];
    } else {
      socket.emit("output", "Unsupported language.");
      return;
    }

    runningProcess = spawn(command, args);

    // output
    runningProcess.stdout.on("data", (data) => {
      console.log("Output:", data.toString());

      socket.emit("output", data.toString());
      socket.to(room).emit("acceptOutput", data.toString());
    });

    //error output
    runningProcess.stderr.on("data", (data) => {
      socket.emit("output", `Error: ${data.toString()}`);
      socket.to(room).emit("acceptOutput", `Error: ${data.toString()}`);
    });

    runningProcess.on("close", () => {
      socket.emit("done");
    });

    //input
    socket.on("sendInput", (input, room) => {
      if (runningProcess) {
        console.log(input);
        runningProcess.stdin.write(input + "\n");
      }
    });
  });

  socket.on("codeChange", (value, socket_id, room) => {
    console.log("Code received:", value, "from socket:", socket_id, room);
    

    room_info[room] = { code: value };

    console.log(room_info);

    // Broadcast the change to all other sockets except the sender
    socket.to(room).emit("acceptCode", value);
  });

  socket.on("checkCode", (room) => {
    console.log("Checking code for room:", room, room_info);

    
    if (room_info[room]?.code) {
      console.log("Code found for room:", room, "->", room_info[room].code);

      
      io.to(room).emit("acceptCode1", room_info[room].code);
    } else {
      console.log("No code found for room:", room);
    }
  });

  socket.on("cursorMove", ({ userId, position }) => {
    // users[userId].cursor = position;
    console.log(userId, position);
    socket.broadcast.emit("cursorUpdate", { userId, position });
  });

  socket.on("join_room", ({ name, room }) => {
    console.log("Joining room:", name, room);
    socket.join(room);
    socket.emit("room_joined", `Welcome ${name} to room ${room}`);
    socket.to(room).emit("new_user", name);

    const activeRooms = [...io.sockets.adapter.rooms.keys()];
    const filteredRooms = activeRooms.filter(
      (room) => io.sockets.adapter.rooms.get(room).size > 1
    );

    if (room_info[room] === undefined) {
      room_info[room] = { code: "" };
    }
    

    console.log("Active User-Created Rooms:", filteredRooms);
  });

  socket.on("disconnect", () => {
    if (runningProcess) runningProcess.kill();
    delete newSocketUser[socket.id];
    console.log("Client disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
import userRouter from "./routes/user.routes.js";
app.use("/api/auth", userRouter);

export { app, server, io };
