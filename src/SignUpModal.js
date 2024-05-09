import React, { useState } from 'react';

const SignUpModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3095/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await response.json();
      if(data.message === '이미 존재하는 사용자입니다'){
        alert('회원가입 실패: 이미 존재하는 사용자입니다');
      } else if(data.data === '회원가입 완료했습니다'){
        alert('회원가입 성공!');
        window.location.reload(); // 페이지 새로고침
      } 
    } catch (error) {
      alert(`오류: ${error}`);
    }
  };

  // 모달의 표시 여부를 제어
  if (!isOpen) return null;

  return (
    <div>
      <div>회원가입</div>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="nickname" // "nickname"이 아닌 "text" 타입을 사용해야 함
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
      <button onClick={onClose}>닫기</button>
    </div>
  );
};

export default SignUpModal;
