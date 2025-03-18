// // sockets/socketHandler.js
// module.exports = (io) => {
//     io.on("connection", (socket) => {
//       console.log("New client connected:", socket.id);

//       socket.on("disconnect", () => {
//         console.log("Client disconnected:", socket.id);
//       });
//     });
//   };

//   // socketHandler.js  
module.exports = (io) => {
  console.log("✅ Socket.IO Handler Loaded"); // Add this to confirm execution
  let companySockets = {}; // Store connected company sockets

  io.on("connection", (socket) => {
    console.log("🔵 A client connected:", socket.id);

    socket.on("joinUser", (userId) => {
      socket.join(userId); // User joins their own room
      console.log(`👤 User ${userId} joined their room`);
    });

    socket.on("newOrder", (order) => {
      console.log("🛒 New order received:", order);
      io.emit("orderUpdate", order);
    });

    // Join company-specific room
    socket.on("joinCompany", (companyId) => {
      socket.join(companyId);
      companySockets[companyId] = socket.id;
      console.log(`Company ${companyId} joined`);
    });

      // Handle message sending
      socket.on("sendMessage", ({ senderCompany, receiverCompany, message }) => {
      console.log(`Message from ${senderCompany} to ${receiverCompany}: ${message}`);

      // Send message to the receiver company
      io.to(receiverCompany).emit("receiveMessage", {
        senderCompany,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("🔴 A client disconnected:", socket.id);
    });
  });
};
