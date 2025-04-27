// import { ReactElement, useState, useEffect } from "react";
// import ChatApp from "../components/homepage/ChatPage";

// function Chat(): ReactElement {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   if (!user) {
//     return <div>Loading user...</div>;
//   }

//   return (
//     <div className="App">
//       <ChatApp
//         userId={user.id}
//         role={user.role}
//         name={user.name}
//         avatar={user.avatar}
//       />
//     </div>
//   );
// }

// export default Chat;