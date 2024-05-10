import React, { useState } from "react";
import SignUpModal from "./SignUpModal";
import "./LoginPage.css";
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3095/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data)
      console.log(data.nickName)
      console.log(data.data.nickName)
      console.log(data.data.accessToken)
      if (data.message === '비밀번호가 일치하지 않습니다') {
        alert('패스워드 오류');
      } else if (data.message === '사용자를 찾을 수 없습니다') {
        alert('사용자 정보 조회 실패');
      } else if (response.ok || data.data.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("nickName", data.data.nickName);
        alert('로그인 성공!'); // 페이지 이동 후에 alert를 호출합니다.
        navigate('/chat'); // 페이지 이동
      }
    } catch (error) {
      console.error("네트워크 에러:", error);
    }
  };

  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);


  return (
    <div className="login-container">
      {" "}
      {/* 이 부분에 클래스 이름 추가 */}
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">이메일:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">비밀번호:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button onClick={openSignUpModal}>회원가입</button>
      <SignUpModal isOpen={isSignUpModalOpen} onClose={closeSignUpModal} />
    </div>
  );
}
export default LoginPage;
