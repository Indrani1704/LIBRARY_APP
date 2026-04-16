//  LOAD ENV FIRST (VERY IMPORTANT)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//  NEW (Socket.IO setup)
const http = require("http");
const { Server } = require("socket.io");

// DB
const connectDB = require("./src/config/db");

// ROUTES
const authRoutes = require("./src/routes/authRoutes");
const bookRoutes = require("./src/routes/book.routes");
const authorRoutes = require("./src/routes/author.routes");
const categoryRoutes = require("./src/routes/category.routes");
const publisherRoutes = require("./src/routes/publisher.routes");
const adminRoutes = require("./src/routes/adminRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const SupportMessage = require("./src/models/SupportMessage");
const User = require("./src/models/User"); 

// UTILS
const createAdmin = require("./src/utils/createAdmin");

const app = express();

//  CREATE HTTP SERVER
const server = http.createServer(app);

//  SOCKET.IO INIT
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://libraryappfrontend-inky.vercel.app"
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// ================= DATABASE =================
connectDB();

// ================= MIDDLEWARE =================

//  CORS (ONLY ONCE)
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://libraryappfrontend-inky.vercel.app"
  ],
  credentials: true,
}));

// BODY PARSER
app.use(express.json());

//  COOKIE PARSER
app.use(cookieParser());

//  STATIC FILES
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

app.use("/api/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/authors", authorRoutes);
app.use("/categories", categoryRoutes);
app.use("/publishers", publisherRoutes);
app.use("/payment", paymentRoutes);
app.use("/admin", adminRoutes);
app.use("/api/cart", require("./src/routes/cartRoutes"));
app.use("/api/wishlist", require("./src/routes/wishlistRoutes"));

// =================  SOCKET LOGIC =================

// =================  SOCKET LOGIC =================



io.on("connection", (socket) => {
  console.log(" Connected:", socket.id);

  //  GET USER LIST (ADMIN)
 const mongoose = require("mongoose"); 

socket.on("get_users", async () => {
  const users = await SupportMessage.aggregate([
    { $sort: { createdAt: 1 } },

    {
      $group: {
        _id: "$userId", // still string
        lastMessage: { $last: "$text" },
        time: { $last: "$createdAt" },
        unread: {
          $sum: {
            $cond: [{ $eq: ["$isRead", false] }, 1, 0],
          },
        },
      },
    },

    //  CONVERT STRING → OBJECTID
    {
      $addFields: {
        userObjId: { $toObjectId: "$_id" },
      },
    },

    //  JOIN USERS
    {
      $lookup: {
        from: "users",
        localField: "userObjId",
        foreignField: "_id",
        as: "user",
      },
    },

    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },

    {
      $addFields: {
        userName: "$user.name",
      },
    },

    { $sort: { time: -1 } },
  ]);

  socket.emit("users_list", users);
});

  //  LOAD USER CHAT
  socket.on("load_messages", async (userId) => {
    const msgs = await SupportMessage.find({ userId }).sort({
      createdAt: 1,
    });

    // mark messages as read
    await SupportMessage.updateMany(
      { userId, sender: "user" },
      { isRead: true }
    );

    socket.emit("all_messages", msgs);
  });

  //  SEND MESSAGE (FINAL FIX )
  socket.on("send_message", async (data) => {
    try {
      let userName = data.userName;

      //  AUTO FETCH NAME FROM DB IF MISSING
      if (!userName && data.userId) {
        const user = await User.findById(data.userId);
        userName = user?.name || "User";
      }

      const saved = await SupportMessage.create({
        ...data,
        userName, // ALWAYS SAVED
      });

      io.emit("receive_message", saved);
    } catch (err) {
      console.error("Socket Error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(" Disconnected");
  });
});

// ================= DEFAULT ADMIN =================
createAdmin();

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send(" Bookstore API Running");
});

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(" ERROR:", err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

// ❗ IMPORTANT: use server.listen instead of app.listen
server.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});