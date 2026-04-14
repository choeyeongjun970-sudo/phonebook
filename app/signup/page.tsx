'use client';

import { signup } from '@/app/actions/auth';
import Link from 'next/link';
import { useState, useTransition } from 'react';

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const res = await signup(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="signup-container">
      <div className="signup-box">
        <div className="brand">
          <h1>회원가입</h1>
          <p>빠르고 쉽습니다.</p>
        </div>
        
        <form action={handleSubmit} className="signup-form">
          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}
          
          <input type="email" name="email" placeholder="이메일 주소" required />
          <input type="password" name="password" placeholder="새 비밀번호" required />
          <p className="terms">
            계정을 만들면 서비스 약관, 개인정보 정책에 동의하게 됩니다.
          </p>
          <button type="submit" disabled={isPending}>
            {isPending ? '가입 중...' : '가입하기'}
          </button>
          
          <Link href="/login" className="login-link">
            이미 계정이 있으신가요? 로그인하기
          </Link>
        </form>
      </div>

      <style jsx>{`
        .signup-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f2f5;
        }
        .signup-box {
          width: 432px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        .brand {
          border-bottom: 1px solid #dadde1;
          margin-bottom: 20px;
          padding-bottom: 10px;
        }
        .brand h1 {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 0;
        }
        .brand p {
          color: #606770;
          font-size: 15px;
        }
        .signup-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .error-message {
          background-color: #ffebe8;
          border: 1px solid #dd3c10;
          padding: 10px;
          color: #1c1e21;
          font-size: 13px;
          border-radius: 4px;
        }
        .success-message {
          background-color: #e7f3ff;
          border: 1px solid var(--fb-blue);
          padding: 10px;
          color: #1c1e21;
          font-size: 13px;
          border-radius: 4px;
        }
        .signup-form input {
          padding: 11px;
          background-color: #f5f6f7;
          border: 1px solid #dddfe2;
          border-radius: 5px;
          font-size: 15px;
        }
        .signup-form input:focus {
          outline: none;
          border-color: var(--fb-blue);
        }
        .terms {
          font-size: 11px;
          color: #777;
          margin-top: 5px;
        }
        .signup-form button {
          background-color: #00a400;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 18px;
          font-weight: 700;
          padding: 10px;
          cursor: pointer;
          margin-top: 5px;
        }
        .signup-form button:hover {
          background-color: #008a00;
        }
        .login-link {
          text-align: center;
          color: var(--fb-blue);
          font-size: 17px;
          text-decoration: none;
          margin-top: 10px;
        }
        .login-link:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
