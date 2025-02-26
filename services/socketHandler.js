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

  io.on("connection", (socket) => {
    console.log("🔵 A client connected:", socket.id);

    socket.on("newOrder", (order) => {
      console.log("🛒 New order received:", order);
      io.emit("orderUpdate", order);
    });

    socket.on("disconnect", () => {
      console.log("🔴 A client disconnected:", socket.id);
    });
  });
};
