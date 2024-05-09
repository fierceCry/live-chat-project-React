import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./ChatApp.css";

const socket = io("http://localhost:3095");
console.log(socket)
function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);
  const hasAskedUsername = useRef(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    console.log(accessToken)
    if (!hasAskedUsername.current) {
      const inputUsername = prompt("이름을 입력하세요:", "User");
      setUsername(inputUsername);

      if (inputUsername) {
        socket.emit("join", { username: inputUsername });
      }

      hasAskedUsername.current = true;
    }

    socket.on("init", (loadedMessages) => {
      setMessages(loadedMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("init");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit("message", { sender: username, content: input });
      setInput("");
    }
  };
  
  const handleInput = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="messages">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={msg.sender === username ? "my-message" : "other-message"}
          >
            {msg.sender ? `${msg.sender}: ${msg.content}` : msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatApp;
