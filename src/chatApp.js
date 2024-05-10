import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import "./ChatApp.css";
import { useNavigate } from "react-router-dom";

function ChatApp() {
  // 메시지, 입력, 사용자 이름, 소켓 연결을 관리하는 상태 변수
  const [messages, setMessages] = useState([]); // 채팅 메시지를 저장하는 배열
  const [input, setInput] = useState(""); // 메시지를 입력하는 입력 필드
  const [username, setUsername] = useState(""); // 현재 사용자의 이름
  const messagesEndRef = useRef(null); // 메시지를 맨 아래로 스크롤하기 위한 ref
  const hasAskedUsername = useRef(false); // 사용자 이름을 물어본 적이 있는지 추적하는 ref
  const navigate = useNavigate(); // 페이지 간 이동을 위한 훅
  const [socket, setSocket] = useState(null); // 소켓 연결을 위한 상태 변수

  useEffect(() => {
    // 컴포넌트가 마운트되거나 업데이트될 때 실행되는 함수
    const accessToken = localStorage.getItem("accessToken"); // 로컬 스토리지에서 액세스 토큰 가져오기
    const userName = localStorage.getItem("nickName"); // 로컬 스토리지에서 사용자 이름 가져오기
    
    console.log("chat:"+accessToken)
    console.log("chat:"+userName)
    setUsername(userName); // 사용자 이름 상태 변수 설정
    if (!accessToken) {
      // 액세스 토큰이 없으면 로그인 페이지로 이동
      navigate("/");
    }

    // 서버와의 소켓 연결 초기화
    const newSocket = io("http://localhost:3095", {
      query: { token: accessToken }, // 쿼리 매개변수로 액세스 토큰 전달
    });
    setSocket(newSocket); // 새로운 소켓 인스턴스로 소켓 상태 변수 설정

    // 연결 시 서버에 'join' 이벤트 전송
    newSocket.emit("join", { accessToken: accessToken });

    // 서버에서 초기 메시지 수신 이벤트 리스너
    newSocket.on("init", (loadedMessages) => {
      setMessages(loadedMessages); // 초기 메시지로 메시지 상태 변수 업데이트
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 메시지 맨 아래로 스크롤
    });

    // 서버에서 새 메시지 수신 이벤트 리스너
    newSocket.on("message", (message) => {
      console.log(message)
      setMessages((prevMessages) => [...prevMessages, message]); // 새 메시지를 메시지 상태 변수에 추가
    });

    // 이벤트 리스너 제거 및 소켓 연결 닫기를 위한 클린업 함수
    return () => {
      newSocket.off("init"); // 'init' 이벤트 리스너 제거
      newSocket.off("message"); // 'message' 이벤트 리스너 제거
      newSocket.close(); // 소켓 연결 닫기
    };
  }, [navigate]); // 의존성 배열 - navigate가 변경될 때 useEffect 실행

  useEffect(() => {
    // 메시지 상태 변수가 업데이트될 때 메시지를 맨 아래로 스크롤하는 함수
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // 메시지를 맨 아래로 스크롤
  }, [messages]); // 의존성 배열 - messages가 변경될 때 useEffect 실행

  // 메시지를 전송하는 함수
  const sendMessage = () => {
    if (input.trim() && socket) {
      // 입력이 비어있지 않고 소켓 연결이 존재하는지 확인
      socket.emit("message", { sender: username, content: input }); // 메시지 데이터와 함께 'message' 이벤트 전송
      setInput(""); // 메시지 전송 후 입력 필드 지우기
    }
  };

  // 입력 필드 onChange 이벤트 핸들러
  const handleInput = (e) => {
    setInput(e.target.value); // 입력된 메시지로 입력 상태 변수 업데이트
  };

  // 입력 필드 onKeyPress 이벤트 핸들러
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      // Enter 키가 눌렸고 Shift 키가 눌리지 않은 경우
      e.preventDefault(); // 기본 동작(폼 제출) 방지
      sendMessage(); // sendMessage 함수 호출하여 메시지 전송
    }
  };

  // 채팅 애플리케이션 UI를 렌더링하는 JSX 구조
  return (
    <div className="chat-container">
      <h2>채팅</h2>
      <div className="messages">
        {/* 메시지 배열을 매핑하고 각 메시지를 렌더링 */}
        {messages.map((msg, index) => (
          <p
            key={index}
            className={
              msg.nickName === username ? "my-message" : "other-message"
            }
          >
            {/* 발신자 이름과 함께 메시지 내용 표시 */}
            {msg.nickName ? `${msg.nickName}: ${msg.content}` : msg.content}
          </p>
        ))}
        <div ref={messagesEndRef} /> {/* 메시지를 맨 아래로 스크롤하기 위한 빈 div */}
      </div>

      {/* 메시지를 입력하는 입력 필드 */}
      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
        />
        <button onClick={sendMessage}>보내기</button> {/* 메시지 전송 버튼 */}
      </div>
    </div>
  );
}

export default ChatApp; // ChatApp 컴포넌트를 내보내기
