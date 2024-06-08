'use client';
import SideBar from '@/app/components/SideBar';
import '@/app/globals.css';
import Header from '@/app/components/Header';
import { metadata } from '@/app/layout';
import Footer from '@/app/components/Footer';
import RecipeDelete from '@/app/components/RecipeDelete';
import RecipeItemRegister from '@/app/components/RecipeItemRegister';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import RUAPI from '@/app/api/Recipe';
import UserAPI from '@/app/api/user';

interface Item {
    id: number,
    nome_refeicao: string,
    tipo_refeicao: string
}



export default function CadastrarCardapio() {

    const [Items, setItems] = useState<Item[]>([]);
    const [sideBarControl, setSideBarControl] = React.useState(false);
    const [validUser, setValidUser] = React.useState(false);

    useEffect(() => {
        document.title = 'Cadastrar Alimentos';

        async function getAlimentos() {
            let response = await RUAPI.getAlimentos();
            setItems(response);
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
                    <RecipeItemRegister items={Items?.filter((item) => item.tipo_refeicao === 'N')} title='Cadastrar Refeição' tipo='N' />

                    <RecipeItemRegister items={Items?.filter((item) => item.tipo_refeicao === 'V')} title='Cadastrar Refeição Vegetariana' tipo="V" />

                    <RecipeItemRegister items={Items?.filter((item) => item.tipo_refeicao === 'A')} title='Cadastrar Acompanhamento' tipo="A" />
                </main>
            </div>
            <Footer />
        </div>
    )
}