'use client';
import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import React from "react";


export default function Home() {

  const [sideBarControl, setSideBarControl] = React.useState(false);

  return (
    <div className="my-container">
      <div className="relative w-full">
        <SideBar controller={sideBarControl} setController={setSideBarControl} />
        <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
        <main className="flex min-h-screen flex-col items-center justify-between p-24">

        </main>
      </div>
      <Footer />
    </div>
  );
}
