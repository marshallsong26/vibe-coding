import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "오늘왜그래 ㅎㅎ | 우리 아이를 이해하는 가장 재미있는 방법",
  description: "타고난 기질부터 오늘의 행동까지, 아이만의 이유를 발견하고 부모에게 작은 작전을 건네요.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ko"><body>{children}</body></html>;
}
