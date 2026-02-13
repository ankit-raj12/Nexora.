import axios from "axios";
import "dotenv/config";
import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const port = process.env.PORT;
app.use(express.json());
app.get("/", (req, res) => {
  res.end("Server is running successfully");
});

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
  },
});

io.on("connection", (socket) => {

  socket.on("identity", async (userId) => {
    socket.userId = userId;
    try {
      await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
        userId,
        socketId: socket.id,
        onlineStatus: true,
      });
    } catch (error) {
      console.error("Error connecting user:", error);
    }
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    const location = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    try {
      await axios.post(
        `${process.env.NEXT_BASE_URL}/api/socket/update-location`,
        {
          userId,
          location,
        },
      );
    } catch (error) {
      console.error("Error updating location:", error);
    }
    io.emit("update-delivery-location", { userId, location });
  });

  socket.on("join-room",(orderId) => {
    socket.join(orderId)
  })

  socket.on("send-message",async (message) => {
    try {
      await axios.post(`${process.env.NEXT_BASE_URL}/api/chat/save`,message)
      io.to(message.orderId).emit("send-message",message);
    } catch (error) {
    }
  })

  socket.on("disconnect", async () => {
    const userId = socket.userId || null;
    try {
      await axios.post(`${process.env.NEXT_BASE_URL}/api/socket/connect`, {
        userId: userId,
        socketId: socket.id,
        onlineStatus: false,
      });
    } catch (error) {
      console.error("Error disconnecting user:", error);
    }
  });
});

app.post("/notify", (req, res) => {
  const { socketId, event, data } = req.body;

  if (socketId) io.to(socketId).emit(event, data);
  else io.emit(event, data);

  return res.status(200).json({ success: true });
});

server.listen(port, () => {
  console.log(`Server is running on: http://localhost:${port}`);
});
