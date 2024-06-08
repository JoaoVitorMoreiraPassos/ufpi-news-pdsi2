'use client';
import SideBar from '@/app/components/SideBar'
import '@/app/globals.css'
import Header from '@/app/components/Header'
import './style.css'
import { metadata } from '@/app/layout'
import Footer from '@/app/components/Footer'
import MealForm from '@/app/components/MealForm'
import MealFormsContainer from '@/app/components/MealFormsContainer'
import { useState, useEffect, use } from 'react'
import axios from 'axios'
import { List } from 'postcss/lib/list';
import UserAPI from '@/app/api/user';
import RUAPI from '@/app/api/Recipe';

interface Item {
    id: number,
    nome_refeicao: string,
    tipo_refeicao: string,
}

export default function CadastrarRefeicao() {
    const [regularRecipes, setRegularRecipes] = useState<Array<Item>>([])
    const [vegRecipes, setVegRecipes] = useState<Array<Item>>([])
    const [followUps, setFollowUps] = useState<Array<Item>>([])
    const [validUser, setValidUser] = useState(false);
    const [sideBarControl, setSideBarControl] = useState(false);

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
        document.title = 'Cadastrar Refeição'
        async function getAlimentos() {
            const response = await RUAPI.getAlimentos();
            let items: Array<Item> = response;
            const reg = items.filter((item) => item.tipo_refeicao === 'N');
            const veg = items.filter((item) => item.tipo_refeicao === 'V');
            const fol = items.filter((item) => item.tipo_refeicao === 'A');
            if (reg) {
                setRegularRecipes(reg);
            }
            if (veg) {
                setVegRecipes(veg);
            }
            if (fol) {
                setFollowUps(fol);
            }
        }
        getAlimentos();
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

    return (
        <div className='my-container'>
            <div className="relative w-full" >
                <SideBar controller={sideBarControl} setController={setSideBarControl} />
                <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                <main className='flex-row flex p-14 justify-center gap-10 flex-wrap'>
                    {
                        regularRecipes.length == 0 && vegRecipes.length == 0 && followUps.length == 0 ?
                            <p className='text-2xl text-center'>
                                Ainda não há alimentos cadastrados no sistema.
                            </p>
                            :
                            <MealFormsContainer regular_recipes={regularRecipes} veg_recipes={vegRecipes} follow_ups={followUps} />
                    }
                </main>
            </div>
            <Footer />
        </div>
    )
}