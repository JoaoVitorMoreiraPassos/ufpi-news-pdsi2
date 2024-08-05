'use client';
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import React from "react";
import FoodMenu from "./components/FoodMenu";
import NoticesContainer from "./components/NoticesContainer";
import RUAPI from "@/app/api/Recipe";
import NoticeAPI from "@/app/api/Notice";
import Input from "./components/Inputs/Input";
import { CircularProgress } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

type Menu = {
  alimentos: number[]
  ativo: boolean
  data: string
  id: number
  tipo: string
}

type Alimento = {
  id: number
  nome_refeicao: string
  tipo_refeicao: string
  ativo: boolean
  tipo_refeicao_nome: string
}

export default function Home() {

  const [sideBarControl, setSideBarControl] = React.useState(false);
  const brazilianTimeZone = 'America/Sao_Paulo';

  const currentDateTimeInBrazil = format(new Date(), 'yyyy-MM-dd', {
    timeZone: brazilianTimeZone,
  } as any
  );
  const [date, setDate] = React.useState<string>(currentDateTimeInBrazil);
  const [menu, setMenu] = React.useState<{ lunch: Alimento[], dinner: Alimento[] }>({ lunch: [], dinner: [] });
  const [loadingMenu, setLoadingMenu] = React.useState(true);
  const [notices, setNotices] = React.useState<any[]>([]);
  const [next, setNext] = React.useState('');
  const [loadingNotices, setLoadingNotices] = React.useState(true);

  React.useEffect(() => {
    document.title = "Página Inicial";
  }, []);

  React.useEffect(() => {
    const getNotices = async () => {
      setLoadingNotices(true);
      try {
        const response = await NoticeAPI.ListPost();
        setNotices(response.results);
        setNext(response.next);
        setLoadingNotices(false);
      }
      catch (error) {
        setLoadingNotices(false);
        console.error(error);
      }
      setLoadingNotices(false);
    }
    const getRecipes = async () => {
      try {
        setLoadingMenu(true);
        const response = await RUAPI.getCardapio();
        const almoco = response.filter((item: any) => item.tipo === "A" && item.data === date)[0];
        const jantar = response.filter((item: any) => item.tipo === "J" && item.data === date)[0];

        let almoco_alimentos = [];
        if (almoco) {

          for (let i = 0; i < almoco.alimentos.length; i++) {
            const alimento = await RUAPI.getAlimento(almoco.alimentos[i]);
            almoco_alimentos.push(alimento);
          }

        }
        let jantar_alimentos = [];
        if (jantar) {
          for (let i = 0; i < jantar.alimentos.length; i++) {
            const alimento = await RUAPI.getAlimento(jantar.alimentos[i]);
            jantar_alimentos.push(alimento);
          }
        }
        setMenu({ lunch: almoco_alimentos, dinner: jantar_alimentos });
        setLoadingMenu(false);
      } catch (error) {
        console.error(error);
        setLoadingMenu(false);
      }
    };
    if (date) {
      getRecipes();
    }
    getNotices();
  }, [date]);

  return (
    <div className="my-container">

      <div className="relative w-full">
        <SideBar controller={sideBarControl} setController={setSideBarControl} />
        <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
        <main className="flex min-h-screen max-sm:px-0">

          <section className="w-full min-[sm]:px-8 pt-10 pb-4 flex flex-col flex-wrap gap-8 justify-center items-center">
            <div className="flex flex-row items-center gap-2 justify-self-start w-full pl-4">
              <FontAwesomeIcon className="w-4 h-4" icon={faPlay} style={{
                color: "#4C84F2",
              }} />
              <h1 className='text-xl'>Cardapio</h1>
            </div>
            <div className="w-40">
              <Input id="menu-date" type="date" placeholder="" value={date} setValue={setDate} />
            </div>
            <div className="flex flex-row gap-8 items-center flex-wrap justify-center">
              {
                loadingMenu ? <CircularProgress /> :
                  <>
                    {
                      menu.lunch.length > 0 ? (
                        <FoodMenu meal="Almoço" data={menu.lunch} />

                      ) : (
                        <h1 className="bg-white p-4 rounded-md">Nenhum almoço cadastrado para essa data.</h1>
                      )
                    }
                    {
                      menu.dinner.length > 0 ? (
                        <FoodMenu meal="Jantar" data={menu.dinner} />
                      ) : (
                        <h1 className="bg-white p-4 rounded-md">Nenhum jantar cadastrado para essa data.</h1>
                      )
                    }
                  </>
              }

            </div>
            <div
              className="w-11/12 bg-gray-600 mt-20"
              style={{
                height: ".5px",
              }}
            ></div>
          </section>
          <section className="w-full">
            <NoticesContainer title="Notícias Recentes" noticesList={notices} nextNotices={next} loading={loadingNotices} />
          </section>

        </main >
      </div >
      <Footer />
    </div >
  );
}
