'use client';

import { login } from '@/app/actions/auth';
import Link from 'next/link';
import { useState } from 'react';
import { useTransition } from 'react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const res = await login(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="brand">
          <h1>Phonebook</h1>
          <p>친구, 가족, 직장 동료의 연락처를 안전하게 보관하세요.</p>
        </div>
        
        <form action={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          <input type="email" name="email" placeholder="이메일 주소" required />
          <input type="password" name="password" placeholder="비밀번호" required />
          <button type="submit" disabled={isPending}>
            {isPending ? '로그인 중...' : '로그인'}
          </button>
          
          <div className="divider"></div>
          
          <Link href="/signup" className="signup-btn">
            새 계정 만들기
          </Link>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f2f5;
        }
        .login-box {
          display: flex;
          align-items: center;
          gap: 80px;
          max-width: 1000px;
          padding: 20px;
        }
        .brand {
          width: 500px;
        }
        .brand h1 {
          color: var(--fb-blue);
          font-size: 60px;
          font-weight: 800;
          margin-bottom: 20px;
        }
        .brand p {
          font-size: 28px;
          font-weight: 500;
          line-height: 1.2;
          color: #1c1e21;
        }
        .login-form {
          width: 400px;
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1);
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
        .login-form input {
          padding: 14px 16px;
          border: 1px solid #dddfe2;
          border-radius: 6px;
          font-size: 17px;
        }
        .login-form input:focus {
          outline: none;
          border-color: var(--fb-blue);
          box-shadow: 0 0 0 2px #e7f3ff;
        }
        .login-form button {
          background-color: var(--fb-blue);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 20px;
          font-weight: 700;
          padding: 12px;
          cursor: pointer;
        }
        .login-form button:hover {
          background-color: #166fe5;
        }
        .divider {
          border-bottom: 1px solid #dadde1;
          margin: 10px 0;
        }
        .signup-btn {
          background-color: #42b72a;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 17px;
          font-weight: 700;
          padding: 12px;
          text-align: center;
          text-decoration: none;
        }
        .signup-btn:hover {
          background-color: #36a420;
        }
        @media (max-width: 900px) {
          .login-box {
            flex-direction: column;
            gap: 40px;
            padding: 40px 20px;
          }
          .brand {
            width: 100%;
            text-align: center;
          }
          .brand h1 {
            font-size: 40px;
          }
          .brand p {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}
