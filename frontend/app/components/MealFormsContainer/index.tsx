'use client'
import React, { useEffect } from 'react'
import MealForm from '../MealForm'
import { useState } from 'react'
import moment from 'moment-timezone';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import axios from 'axios';
import RUAPI from '@/app/api/Recipe';

interface Item {
    id: Number,
    nome_refeicao: string,
    tipo_refeicao: string
}

interface cardapio {
    id?: Number,
    data: string,
    tipo: string,
    alimentos: Array<Number>,
    alimentos_adicionais: Array<Number>
}

const MealFormsContainer = ({ regular_recipes, veg_recipes, follow_ups }: { regular_recipes: Item[], veg_recipes: Item[], follow_ups: Item[] }) => {

    const brazilianTimeZone = 'America/Sao_Paulo';

    const currentDateTimeInBrazil = format(new Date(), 'yyyy-MM-dd', {
        timeZone: brazilianTimeZone,
    } as any
    );

    const [date, setDate] = useState(currentDateTimeInBrazil);
    const [almocoGeral, setAlmocoGeral] = useState<Number>();
    const [almocoVeg, setAlmocoVeg] = useState<Number>();
    const [almocoAcompanhamentos, setAlmocoAcompanhamentos] = useState<Array<Item>>([]);
    const [jantarGeral, setJantarGeral] = useState<Number>();
    const [jantarVeg, setJantarVeg] = useState<Number>();
    const [jantarAcompanhamentos, setJantarAcompanhamentos] = useState<Array<Item>>([]);
    const [almoco_atual, setAlmoco_atual] = useState<Array<Number>>([]);
    const [jantar_atual, setJantar_atual] = useState<Array<Number>>([]);
    const [almoco_id, setAlmoco_id] = useState<Number>();
    const [jantar_id, setJantar_id] = useState<Number>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getCardapios = async () => {
            try {
                const token = localStorage.getItem('acessToken') ?? "";
                const response = await RUAPI.getCardapioByDate(token, date);

                const cardapios: cardapio[] = response;
                const almoco = cardapios.filter((cardapio) => cardapio.tipo === 'A' && cardapio.data === date);
                const jantar = cardapios.filter((cardapio) => cardapio.tipo === 'J' && cardapio.data === date);
                if (almoco.length > 0) {
                    setAlmoco_id(almoco[0].id);
                    let alimentos = [];
                    for (let i in almoco[0].alimentos) {
                        const alimento = await RUAPI.getAlimento(almoco[0].alimentos[i]);
                        alimentos.push(alimento);
                    }
                    console.log(alimentos);
                    const vegan = alimentos.filter((alimento) => alimento.tipo_refeicao === 'V');
                    const regular = alimentos.filter((alimento) => alimento.tipo_refeicao === 'N');
                    const follow_ups = alimentos.filter((alimento) => alimento.tipo_refeicao === 'A');
                    console.log(vegan);
                    console.log(regular);
                    console.log(follow_ups);
                    setAlmocoGeral(regular[0].id);
                    setAlmocoVeg(vegan[0].id);
                    setAlmocoAcompanhamentos(follow_ups);
                } else {
                    setAlmoco_id(undefined);
                    setAlmocoGeral(undefined);
                    setAlmocoVeg(undefined);
                    setAlmocoAcompanhamentos([]);
                }
                if (jantar.length > 0) {
                    setJantar_id(jantar[0].id);
                    let alimentos = [];
                    for (let i in jantar[0].alimentos) {
                        const alimento = await RUAPI.getAlimento(jantar[0].alimentos[i]);
                        alimentos.push(alimento);
                    }
                    const vegan = alimentos.filter((alimento) => alimento.tipo_refeicao === 'V');
                    const regular = alimentos.filter((alimento) => alimento.tipo_refeicao === 'N');
                    const follow_ups = alimentos.filter((alimento) => alimento.tipo_refeicao === 'A');
                    console.log(vegan);
                    console.log(regular);
                    console.log(follow_ups);
                    setJantarGeral(regular[0].id);
                    setJantarVeg(vegan[0].id);
                    setJantarAcompanhamentos(follow_ups);
                }
                else {
                    setJantar_id(undefined);
                    setJantarGeral(undefined);
                    setJantarVeg(undefined);
                    setJantarAcompanhamentos([]);
                }
                setLoading(false);
            } catch (error) {
                console.log(error)
            }
        }
        getCardapios();
    }, [date])

    useEffect(() => {
        console.log(almocoGeral, almocoVeg, almocoAcompanhamentos, jantarGeral, jantarVeg, jantarAcompanhamentos)
    }, [almocoGeral, almocoVeg, almocoAcompanhamentos, jantarGeral, jantarVeg, jantarAcompanhamentos])
    const Submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (almocoGeral && almocoVeg && almocoAcompanhamentos.length > 0 && jantarGeral && jantarVeg && jantarAcompanhamentos.length > 0) {

            const sendCardapio = async (cardapio: cardapio) => {
                try {
                    const token = localStorage.getItem('acessToken') ?? "";
                    const response = await RUAPI.postCardapio(token, cardapio);
                    if (response.status === 201) {
                        toast.success(`${cardapio.tipo === 'A' ? 'Almoço' : 'Jantar'} cadastrado com sucesso!`);
                    }
                } catch (error) {
                    return;
                }
            }
            const almoco: cardapio = {
                data: date,
                tipo: 'A',
                alimentos: [almocoGeral, almocoVeg, ...almocoAcompanhamentos.map((item) => item.id)],
                alimentos_adicionais: []
            }
            const jantar: cardapio = {
                data: date,
                tipo: 'J',
                alimentos: [jantarGeral, jantarVeg, ...jantarAcompanhamentos.map((item) => item.id)],
                alimentos_adicionais: []
            }
            try {
                await Promise.all([sendCardapio(almoco), sendCardapio(jantar)]);
                toast.success('Refeições cadastradas com sucesso!');
            } catch {
                toast.error('Erro ao cadastrar refeições!');
            }
        }
        else {
            toast.error('Preencha todos os campos!');
        }
    }

    const Update = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (almocoGeral && almocoVeg && almocoAcompanhamentos.length > 0 && jantarGeral && jantarVeg && jantarAcompanhamentos.length > 0) {

            const sendCardapio = async (cardapio: cardapio) => {
                try {
                    const token = localStorage.getItem('acessToken') ?? "";
                    const response = await RUAPI.updateCardapio(token, cardapio.id, cardapio);
                    if (response.status === 200) {
                        toast.success(`${cardapio.tipo === 'A' ? 'Almoço' : 'Jantar'} atualizado com sucesso!`);
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            const almoco: cardapio = {
                id: almoco_id,
                data: date,
                tipo: 'A',
                alimentos: [almocoGeral, almocoVeg, ...almocoAcompanhamentos.map((item) => item.id)],
                alimentos_adicionais: []
            }
            const jantar: cardapio = {
                id: jantar_id,
                data: date,
                tipo: 'J',
                alimentos: [jantarGeral, jantarVeg, ...jantarAcompanhamentos.map((item) => item.id)],
                alimentos_adicionais: []
            }
            console.log(almoco, jantar)
            try {
                await Promise.all([sendCardapio(almoco), sendCardapio(jantar)]);
                toast.success('Refeições atualizadas com sucesso!');
            } catch {
                toast.error('Erro ao atualizar refeições!');
            }

        } else {
            console.log(almocoGeral, almocoVeg, almocoAcompanhamentos.length > 0, jantarGeral, jantarVeg, jantarAcompanhamentos.length > 0)
            toast.error('Preencha todos os campos!');
        }
    }

    return (
        <form className='flex-col flex py-14 px-6 justify-start items-center w-full gap-8' onSubmit={
            almoco_id && jantar_id ? Update : Submit
        }>
            <ToastContainer />
            <p className='text-2xl'>
                Cadastrar Refeição
            </p>
            <section className='flex-col flex gap-2 w-full items-center'>
                <label htmlFor="date">
                    Data:
                </label>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    className='border border-gray-400 rounded-md w-auto text-center'
                    onChange={(e) => setDate(e.target.value)}
                />
            </section>

            <div className='h-full w-full'>
                <div className=' flex flex-row justify-center min-w-300 gap-4 border-blue-500 flex-wrap'>
                    {/* <section >
                        <MealForm regular_recipes={regular_recipes} veg_recipes={veg_recipes} meal='Café da Manhã' follow_ups={follow_ups} />
                    </section> */}
                    {
                        !loading &&
                        <section >
                            <MealForm regular_recipes={regular_recipes} veg_recipes={veg_recipes} meal='Almoço' follow_ups={follow_ups} listenners={[[almocoGeral, setAlmocoGeral], [almocoVeg, setAlmocoVeg], [almocoAcompanhamentos, setAlmocoAcompanhamentos]]} />
                        </section>
                    }
                    {
                        !loading &&
                        <section >
                            <MealForm regular_recipes={regular_recipes} veg_recipes={veg_recipes} meal='Jantar' follow_ups={follow_ups} listenners={[[jantarGeral, setJantarGeral], [jantarVeg, setJantarVeg], [jantarAcompanhamentos, setJantarAcompanhamentos]]} />
                        </section>
                    }
                    {/* <section >
                        <MealForm regular_recipes={regular_recipes} veg_recipes={veg_recipes} meal='Almoço' follow_ups={follow_ups} listenners={[[almocoGeral, setAlmocoGeral], [almocoVeg, setAlmocoVeg], [almocoAcompanhamentos, setAlmocoAcompanhamentos], [almoco_atual, setAlmoco_atual]]} />
                    </section>
                    <section >
                        <MealForm regular_recipes={regular_recipes} veg_recipes={veg_recipes} meal='Jantar' follow_ups={follow_ups} listenners={[[jantarGeral, setJantarGeral], [jantarVeg, setJantarVeg], [jantarAcompanhamentos, setJantarAcompanhamentos], [jantar_atual, setJantar_atual]]} />
                    </section> */}
                </div>
                <div className='flex flex-row w-full justify-center mt-12 flex-wrap-reverse items-start gap-8 px-8 pb-8'>
                    <button className='bg-green-500 text-white w-1/2 h-14 rounded-xl text-xl' type='submit'>
                        {almoco_id && jantar_id ? 'Atualizar' : 'Cadastrar'}
                    </button>
                </div>
            </div>
        </form>
    )
}
export default MealFormsContainer