import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { animals, getAnimalBySlug } from "../../../lib/animals";

type SharePageProps = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return animals.map((animal) => ({ slug: animal.slug }));
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const animal = getAnimalBySlug((await params).slug);
  if (!animal) return {};
  const title = `마음속에는 ‘${animal.alias} ${animal.name}’ 친구가 살고 있대요!`;
  const description = "우리 아이 마음속에는 어떤 꼬마동물이 살고 있을까요?";
  return {
    metadataBase: new URL("https://littlewhytoday.vercel.app"),
    title: `${title} | 오늘왜그래 ㅎㅎ`,
    description,
    openGraph: {
      title,
      description,
      url: `/share/${animal.slug}`,
      siteName: "오늘왜그래 ㅎㅎ",
      type: "website",
      images: [{ url: animal.image, width: 640, height: 640, alt: `${animal.alias} ${animal.name} 캐릭터` }],
    },
  };
}

export default async function SharePage({ params }: SharePageProps) {
  const animal = getAnimalBySlug((await params).slug);
  if (!animal) notFound();
  return <main className="share-landing">
    <div className="share-paper">
      <Link className="logo" href="/">오늘왜그래 <span>ㅎㅎ</span></Link>
      <p className="section-kicker">마음속 꼬마동물 발견!</p>
      <div className="share-animal-art"><Image src={animal.image} alt={`${animal.alias} ${animal.name} 캐릭터`} width={640} height={640} priority /></div>
      <h1>마음속에는<br /><mark>{animal.alias}<br />{animal.name}</mark> 친구가 살고 있대요!</h1>
      <p>우리 아이 마음속에는,<br />어떤 꼬마동물이 살고 있을까요?</p>
      <Link className="share-cta" href="/#top">우리 아이 꼬마동물 만나기</Link>
      <small>생년월일·출생시간·출생 도시는 공유되지 않았어요.</small>
    </div>
  </main>;
}
