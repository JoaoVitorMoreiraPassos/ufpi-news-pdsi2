'use client';
import SideBar from '@/app/components/SideBar'
import '@/app/globals.css'
import Header from '@/app/components/Header'
import './style.css'
import { metadata } from '@/app/layout'
import Footer from '@/app/components/Footer'
import { useState, useEffect, use } from 'react'
import axios from 'axios'
import { List } from 'postcss/lib/list';
import UserAPI from '@/app/api/user';
import RUAPI from '@/app/api/Recipe';
import Input from '@/app/components/Inputs/Input'
import { MenuRegister } from '@/app/components/MenuRegister';
import { format, set } from 'date-fns';
import CircularProgress from '@mui/material/CircularProgress';

type Item = {
    id: number,
    nome_refeicao: string,
    tipo_refeicao: string,
    checked?: boolean
}

type Meal = {
    alimentos: number[],
    ativo: boolean,
    data: string,
    id: number,
    tipo: string,
}

type MyMeal = {
    regular: Item[],
    vegan: Item[],
    follow: Item[],
    id?: number
}

export default function CadastrarRefeicao() {
    const brazilianTimeZone = 'America/Sao_Paulo';

    const currentDateTimeInBrazil = format(new Date(), 'yyyy-MM-dd', {
        timeZone: brazilianTimeZone,
    } as any
    );
    const [validUser, setValidUser] = useState(false);
    const [date, setDate] = useState(currentDateTimeInBrazil);
    const [currentDate, setCurrentDate] = useState(currentDateTimeInBrazil);
    const [sideBarControl, setSideBarControl] = useState(false);
    const [alimentos, setAlimentos] = useState<MyMeal>({ regular: [], vegan: [], follow: [], id: -1 });
    const [almoco, setAlmoco] = useState<MyMeal>({ regular: [], vegan: [], follow: [], id: -1 });
    const [jantar, setJantar] = useState<MyMeal>({ regular: [], vegan: [], follow: [], id: -1 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const token = localStorage.getItem('acessToken') ?? "";
                const response = await UserAPI.getUser(token);
                if (!response) { window.location.href = '/'; return };
                if (!response?.refeicao_permissoes) window.location.href = '/perfil';
            } catch (error: any) {
                console.log(error.toString());
                if (error.toString() === "Error: Token not found") {
                    window.location.href = '/autenticacao/login';
                    return;
                }
                else if (error.toString() === "Error: Refresh token não encontrado") {
                    window.location.href = '/autenticacao/login';
                    return;
                }
            }
        }
        getUser()
    }, [])

    useEffect(() => {
        const loggedUser = localStorage.getItem('user') ?? {};
        if (!loggedUser) {
            window.location.href = '/auth/login';
        }
        const token = localStorage.getItem('acessToken') ?? '';
        const verifyToken = async (token: string) => {
            try {
                const response = await UserAPI.verifyToken(token);
                if (!response) {
                    window.location.href = '/auth/login';
                }
                setValidUser(true);
            }
            catch (err) {
                window.location.href = '/auth/login';
            }
        }
        verifyToken(token);
    }, [])


    useEffect(() => {
        document.title = 'Cadastrar Refeição'
        async function getAlimentos() {
            setLoading(true);
            try {
                const response = await RUAPI.getAlimentos();
                let items: Array<Item> = response;
                let reg = items.filter((item) => item.tipo_refeicao === 'N');
                reg = reg.map((item) => { return { ...item, checked: false } });
                let veg = items.filter((item) => item.tipo_refeicao === 'V');
                veg = veg.map((item) => { return { ...item, checked: false } });
                let fol = items.filter((item) => item.tipo_refeicao === 'A');
                fol = fol.map((item) => { return { ...item, checked: false } });
                if (reg && veg && fol) {
                    setAlimentos({ regular: reg, vegan: veg, follow: fol });
                }
            } catch {
                console.log("Erro ao buscar alimentos");
            }
            setLoading(false);
        }
        getAlimentos();
        setLoading(false);
    }, [date])


    // useEffect(() => { console.log(almoco); console.log(jantar); }, [almoco, jantar])

    useEffect(() => {
        const getMenu = async () => {
            const token = localStorage.getItem('acessToken') ?? '';
            console.log("O culpado é ele")
            if (alimentos.regular.length === 0 && alimentos.vegan.length === 0 && alimentos.follow.length === 0) {
                console.log("alimentos vazio")
                return;
            }
            if (!token) {
                console.log("token vazio")
                return;
            }
            if (!date) {
                console.log("date vazio")
                return;
            }

            try {
                const response = await RUAPI.getCardapioByDate(token, date);
                if (!response) {
                    console.log("response vazio")
                    return;
                }
                console.log("response")
                console.log(response)
                // add checked field on regularRecipes, vegRecipes and followUps if the id is in response

                const temp_almoco: Meal = response.filter((item: any) => item.tipo === 'A' && item.data === date)[0];
                const temp_jantar: Meal = response.filter((item: any) => item.tipo === 'J' && item.data === date)[0];

                console.log("temp_almoco")
                console.log(temp_almoco)
                console.log("temp_jantar")
                console.log(temp_jantar)

                let almoco_aux: MyMeal = { regular: [], vegan: [], follow: [] };
                let jantar_aux: MyMeal = { regular: [], vegan: [], follow: [] };

                if (temp_almoco) {
                    almoco_aux = {
                        regular: alimentos.regular.filter((item) => temp_almoco.alimentos.includes(item.id)),
                        vegan: alimentos.vegan.filter((item) => temp_almoco.alimentos.includes(item.id)),
                        follow: alimentos.follow.filter((item) => temp_almoco.alimentos.includes(item.id)),
                        id: temp_almoco.id
                    }
                }

                if (temp_jantar) {
                    jantar_aux = {
                        regular: alimentos.regular.filter((item) => temp_jantar.alimentos.includes(item.id)),
                        vegan: alimentos.vegan.filter((item) => temp_jantar.alimentos.includes(item.id)),
                        follow: alimentos.follow.filter((item) => temp_jantar.alimentos.includes(item.id)),
                        id: temp_jantar.id
                    }
                }
                setAlmoco(almoco_aux);
                setJantar(jantar_aux);

            } catch (error) {
                console.log(error);
            }
        }
        getMenu();
    }, [date, alimentos])

    return (
        <div className='my-container'>
            <div className="relative w-full" >
                <SideBar controller={sideBarControl} setController={setSideBarControl} />
                <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                <main className='flex flex-col items-center gap-10 pb-20'>
                    <div className='w-48'>
                        <Input id="menu-date" type='date' placeholder='' value={date} setValue={setDate} />
                    </div>
                    {
                        alimentos.regular.length === 0 && alimentos.vegan.length === 0 && alimentos.follow.length === 0 ?
                            (
                                loading ? <CircularProgress /> : <h1>Nenhum alimento encontrado</h1>
                            )
                            :
                            (
                                <div className='w-full flex flex-wrap justify-center gap-10'>
                                    <MenuRegister title='Almoço' type="A" date={date} meal={alimentos} selecteds={almoco} />

                                    <MenuRegister title='Jantar' type="J" date={date} meal={alimentos} selecteds={jantar} />
                                </div>
                            )
                    }
                </main>
            </div>
            <Footer />
        </div>
    )
}