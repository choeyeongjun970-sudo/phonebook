import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "전화번호 관리 시스템 | Phonebook",
  description: "Supabase와 Next.js를 이용한 안전한 전화번호부",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <div className="layout-root">
          <header className="main-header">
            <div className="header-content">
              <h1 className="logo">Phonebook</h1>
            </div>
          </header>
          <div className="main-container">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
