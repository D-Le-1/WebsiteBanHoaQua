// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:8000", {
//   withCredentials: true, // Allow credentials for CORS
//   reconnection: true, // Enable reconnection
// });

// const ChatApp = ({ userId, role, name, avatar }) => {
//   const [messages, setMessages] = useState([]); // Store messages
//   const [currentMessage, setCurrentMessage] = useState(""); // Current message input
//   const [users, setUsers] = useState([]); // Store online users

//   useEffect(() => {
//     // Send user info when connecting
//     socket.emit("init", { userId, role, name, avatar });

//     // Listen for user list updates
//     socket.on("user-list", (userList) => {
//       console.log("User List received:", userList);
//       setUsers(userList);
//     });

//     // Listen for incoming messages
//     socket.on("chat-reply", (data) => {
//       console.log("Received message:", data);
//       setMessages((prev) => [...prev, data]);
//     });

//     // Cleanup on unmount
//     return () => {
//       socket.off("chat-reply");
//       socket.off("user-list");
//     };
//   }, [userId, role, name, avatar]);

//   const handleSendMessage = () => {
//     if (currentMessage.trim()) {
//       // Send message to server
//       socket.emit("chat-message", {
//         message: currentMessage,
//         from: name,
//         avatar,
//       });
//       setCurrentMessage(""); // Clear input
//     }
//   };

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       <div className="w-1/4 bg-gray-200 p-4">
//         <h3 className="text-xl font-bold">Online Users</h3>
//         <ul className="mt-4">
//           {users.map((user) => (
//             <li key={user.userId} className="p-2">
//               {user.name}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Chat Box */}
//       <div className="w-3/4 bg-white p-6 flex flex-col">
//         <div className="flex-grow overflow-auto mb-4">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex ${
//                 msg.from === name ? "justify-end" : "justify-start"
//               } mb-2`}
//             >
//               <div className="flex items-center gap-2">
//                 {msg.avatar && msg.from !== name && (
//                   <img
//                     crossOrigin="anonymous"
//                     src={msg.avatar}
//                     alt={msg.from}
//                     className="w-8 h-8 rounded-full"
//                   />
//                 )}
//                 <div
//                   className={`inline-block rounded-lg p-2 ${
//                     msg.from === name ? "bg-blue-500 text-white" : "bg-gray-300"
//                   }`}
//                 >
//                   {msg.from}: {msg.message}
//                 </div>
//                 {msg.avatar && msg.from === name && (
//                   <img
//                     crossOrigin="anonymous"
//                     src={msg.avatar}
//                     alt={msg.from}
//                     className="w-8 h-8 rounded-full"
//                   />
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Input message */}
//         <div className="flex">
//           <input
//             type="text"
//             className="flex-grow p-2 border border-gray-300 rounded-l-lg"
//             value={currentMessage}
//             onChange={(e) => setCurrentMessage(e.target.value)}
//             onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
//             placeholder="Type a message"
//           />
//           <button
//             className="p-2 bg-blue-500 text-white rounded-r-lg"
//             onClick={handleSendMessage}
//           >
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatApp;