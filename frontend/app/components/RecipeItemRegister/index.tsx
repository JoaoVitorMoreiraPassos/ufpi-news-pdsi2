'use client';
import './style.css';
import React from 'react'
import reactDOM from 'react-dom';
import RecipeDelete from '../RecipeDelete'
import { useState } from 'react';
import RUAPI from '@/app/api/Recipe';
import Input from '../Inputs/Input';

interface Item {
    id: number,
    nome_refeicao: string,
    tipo_refeicao: string
}

const RecipeItemRegister = ({ items, title, tipo }: { items: Item[], title: string, tipo: string }) => {

    const [newItem, setNewItem] = useState("");

    const add_item = async (type: string) => {

        console.log(newItem, type)
        try {
            const token = localStorage.getItem('acessToken') ?? "";
            const response = await RUAPI.postAlimento(token, {
                nome_refeicao: newItem,
                tipo_refeicao: type,
            })
            if (response) {
                if (newItem !== '') {
                    const item: Item = {
                        id: response.id,
                        nome_refeicao: newItem,
                        tipo_refeicao: type,
                    };
                    setNewItem('');
                    const alreadyRegisterElement = document.querySelector(`.alreadyRegister.${tipo}`);
                    if (alreadyRegisterElement) {
                        let div = document.createElement('div');
                        div.id = item.tipo_refeicao + item.id;
                        let recipeDelete = <RecipeDelete item={item} />;
                        div.addEventListener('', () => {

                        })
                        reactDOM.render(recipeDelete, div);
                        alreadyRegisterElement.appendChild(div);
                    }
                }
            }
        } catch (error) {
            console.log("deu erro")
            console.log(error)
        }


    }

    return (
        <section className='flex-col flex p-8 items-center gap-4 toPutShadow bg-white rounded-lg'>
            <div className='flex flex-col gap-2'>
                <label htmlFor={tipo} className='text-xl'>{title}</label>
                <Input value={newItem} setValue={setNewItem} type="text" placeholder='+ Nova Refeição' submit={() => add_item(tipo)} />
                <button type="submit" className=' bg-green-500 text-white rounded-xl p-2 w-80 h-14' onClick={
                    () => {
                        add_item(tipo)
                    }
                }>Cadastrar</button>
                <div className={"alreadyRegister flex flex-col-reverse pb-6 justify-start " + tipo}>

                    {
                        items?.map(item => {
                            return (
                                <div key={item.id} >
                                    <RecipeDelete key={item.id} item={item} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default RecipeItemRegister;