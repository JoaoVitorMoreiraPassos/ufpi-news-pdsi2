'use client';
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import React from "react";
import FoodMenu from "./components/FoodMenu";


export default function Home() {

  const [sideBarControl, setSideBarControl] = React.useState(false);

  return (
    <div className="my-container">
      <div className="relative w-full">
        <SideBar controller={sideBarControl} setController={setSideBarControl} />
        <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
        <main className="flex min-h-screen max-sm:px-0">

          <section className="w-full min-[sm]:px-8 flex flex-row flex-wrap gap-4 justify-center">

            <FoodMenu meal="Almoço" data={["Arroz", "Feijão", "Strogonff de Grão de Bico", "Salada", "Suco"]} />
            <FoodMenu meal="Jantar" data={["Arroz", "Feijão", "Carne", "Salada", "Suco"]} />
            <div
              className="w-11/12 bg-gray-600 mt-8"
              style={{
                height: ".5px",
              }}
            ></div>
          </section>
          <section>

          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
}
