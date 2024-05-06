import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./chatApp.css";

const socket = io("http://localhost:3095");

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    function askUsernameOnce() {
      if (!username) {
        const inputUsername = prompt("이름을 입력하세요:", "User");
        setUsername(inputUsername);
        
        if (inputUsername) {
          socket.emit('join', inputUsername);
        }
      }
    }

    askUsernameOnce();
  
    socket.on("init", (loadedMessages) => {
      setMessages(loadedMessages);
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
          >{`${msg.sender}: ${msg.content}`}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <input
        type="text"
        value={input}
        onChange={handleInput}
        onKeyPress={handleKeyPress}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatApp;
