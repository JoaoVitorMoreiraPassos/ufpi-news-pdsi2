'use client';
import Header from "../components/Header";
import Footer from "../components/Footer";
import SideBar from "../components/SideBar";
import React from "react";


export default function Home() {

    const [sideBarControl, setSideBarControl] = React.useState(false);

    return (
        <div className="my-container">

            <div className="relative w-full">
                <SideBar controller={sideBarControl} setController={setSideBarControl} />
                <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                <main className="flex min-h-screen max-sm:px-0">

                </main>
            </div>
            <Footer />
        </div>
    );
}
