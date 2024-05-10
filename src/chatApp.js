import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { useNavigate } from 'react-router-dom';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const messagesEndRef = useRef(null);
  const hasAskedUsername = useRef(false);
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const userName = localStorage.getItem("nickName") || ""; // 기본값 설정

    setUsername(userName); // username 상태 변수 업데이트

    console.log(userName)
    if(!accessToken){
      console.log('토큰없음')
      navigate('/'); // 페이지 이동
    }

    const newSocket = io("http://localhost:3095", {
      query: { token: accessToken }
    });
    setSocket(newSocket);

    newSocket.emit("join", { accessToken: accessToken });

    newSocket.on("init", (loadedMessages) => {
      setMessages(loadedMessages);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    newSocket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      newSocket.off("init");
      newSocket.off("message");
      newSocket.close();
    };
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() && socket) {
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
