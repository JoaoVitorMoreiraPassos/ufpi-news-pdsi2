'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css';


interface Item {
    id: Number,
    nome_refeicao: string,
    tipo_refeicao: string
}

const MealForm = (
    { meal, regular_recipes, veg_recipes, follow_ups, listenners }: {
        meal: string, regular_recipes: Item[], veg_recipes: Item[], follow_ups: Item[], listenners: any
    }
) => {
    const title = meal;
    meal = meal.trim().replaceAll(' ', '-').toLowerCase();
    const selectStyle = {
        height: '3.5rem',
        padding: '0.5rem',
        fontSize: '1.5rem',
        borderRadius: '0.rem',
        border: '1px solid #000',
        outline: 'none',
        cursor: 'pointer'
    }
    return (
        <div className={'w-full transition-all duration-500 ease-in-out flex flex-col items-center py-8 bg-blue-200 rounded-xl ' + meal} id={meal + '-form'}>
            <p className='text-center text-2xl p-4'>{title}</p>
            <div className='flex flex-col items-center gap-4' >
                <div className='flex flex-row gap-2 flex-wrap justify-center px-10'>
                    <div className='flex flex-col gap-2'>
                        <p className='text-center text-xl'>
                            Refeição Geral
                        </p>
                        <select name="reg-meal" id="reg-meal" className='h-16 px-4 w-60' onChange={(e) => {
                            listenners[0][1](e.target.value)
                        }}
                            value={listenners[0][0] + ''}
                            style={selectStyle}
                        >
                            <option value="" >Esolha uma opção</option>
                            {
                                regular_recipes.map(item => {
                                    if (item.tipo_refeicao === 'N') {
                                        return (
                                            <option value={item.id.toString()} key={'ref' + item.id}
                                            >{item.nome_refeicao}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-center text-xl'>
                            Refeição Vegetariana
                        </p>
                        <select name="veg-meal" id="veg-meal" className='h-16 px-4 w-60' onChange={(e) => {
                            listenners[1][1](e.target.value)
                        }}
                            value={listenners[1][0] + ''}
                            style={selectStyle}
                        >
                            <option value="">Esolha uma opção</option>
                            {
                                veg_recipes.map(item => {
                                    if (item.tipo_refeicao === 'V') {
                                        return (
                                            <option value={item.id.toString()} key={'ref_veg' + item.id}>{item.nome_refeicao}</option>
                                        )
                                    }
                                })
                            }
                        </select>
                    </div>
                </div>
                <p className='text-xl'>
                    Acompanhamentos
                </p>
                <div className={'grid md:grid-cols-3 max-md:grid-cols-2 gap-4  ' + meal + '-follow-ups'}>
                    {
                        follow_ups.map(item => {
                            if (item.tipo_refeicao === 'A') {
                                return (
                                    <div key={item.id.toString()} className='flex flex-row gap-2 items-center ' >
                                        <input type="checkbox" name={item.nome_refeicao + item.id} id={item.nome_refeicao + meal} className='w-6 h-6' onChange={
                                            (e) => {
                                                if (e.target.checked) {
                                                    listenners[2][1]([...listenners[2][0], item]);
                                                } else {
                                                    listenners[2][1](listenners[2][0].filter((element: Item) => element.id !== item.id));
                                                }
                                            }
                                        }
                                            checked={listenners[2][0].findIndex((element: Item) => element.id === item.id) !== -1}
                                        />
                                        <label htmlFor={item.nome_refeicao + meal} className='text-lg'>
                                            {item.nome_refeicao}
                                        </label>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default MealForm;
