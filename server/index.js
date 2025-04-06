const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require("cors");
const axios = require("axios");
const server = http.createServer(app);
const cookieParser = require("cookie-parser");

const { setupBackend } = require("./backend.js");

// Enable CORS
// app.use(cors());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

setupBackend(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};

io.on("connection", (socket) => {
  // console.log('Socket connected', socket.id);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    // console.log(`${username} joined room: ${roomId}`);
    userSocketMap[socket.id] = username;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);

    // notify that new user join
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });

    // when new user join the room all the code which are there are also shows on that persons editor
    // if (clients.length > 1) {
    //   const existingClient = clients[0].socketId; // Get an existing client
    //   io.to(existingClient).emit(ACTIONS.SYNC_CODE, { socketId: socket.id });
    // }
    const existingClient = clients.find(client => client.socketId !== socket.id);
    if (existingClient) {
      io.to(existingClient.socketId).emit(ACTIONS.SYNC_CODE, { socketId: socket.id });
    }
  });

  // sync the code
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // console.log(`Code changed in room ${roomId}:`, code);  
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
  //   // console.log(`Syncing code to ${socketId}`);
  //   io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  // });
  
  // language change 
  socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, lang }) => {
    console.log(`Language chnages to : `,lang);
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { lang });
  });

  // leave room
  socket.on("disconnecting", () => {
    // console.log(`Client disconnected: ${socket.id}`);
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

// Using Piston Api for code running and acting as an online console.

app.post("/compile", async (req, res) => {
  const { code, language } = req.body;

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language, 
      version: "*", // Picks the latest version automatically
      files: [{ content: code }],
    });

    res.json({
      output: response.data.run.output, 
      stderr: response.data.run.stderr || "",
    });
  } catch (error) {
    console.error("Compilation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to compile code" });
  }
});



const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
