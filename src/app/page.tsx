'use client';
import WelcomeUser from "@/components/pages/WelcomeUser/WelcomeUser";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center w-full h-screen">
      <WelcomeUser userName={""}/>
    </div>
  );
}
