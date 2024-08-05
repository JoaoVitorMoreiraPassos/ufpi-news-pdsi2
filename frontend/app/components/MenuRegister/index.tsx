import React from 'react'
import Input from '../Inputs/Input'
import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Select from '../Inputs/Selects'
import RUAPI from '@/app/api/Recipe'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Recipe from '@/app/api/Recipe'

type Item = {
    id: Number,
    nome_refeicao: string,
    tipo_refeicao: string,
    checked?: boolean
}

type Option = {
    value: string;
    label: string;
    checked?: boolean;
};
type Meal = {
    regular: Item[],
    vegan: Item[],
    follow: Item[],
    id?: number
}

export const MenuRegister = ({ title, type, date, meal, selecteds }: { title: string, type: string, date: string, meal: Meal, selecteds: Meal }) => {

    const [regularRecipe, setRegularRecipe] = useState("")
    const [veganRecipe, setVeganRecipe] = useState("")
    const [followRecipe, setFollowRecipe] = useState<Item[]>([])
    const [alimentos, setAlimentos] = useState<Number[]>([])
    const [action, setAction] = useState<boolean>(false);
    const [isSending, setIsSending] = useState(false);


    useEffect(() => {
        setAlimentos([...followRecipe.map((item) => item.id), parseInt(regularRecipe), parseInt(veganRecipe)])
    }, [regularRecipe, veganRecipe, followRecipe])
    useEffect(() => {
        if (selecteds?.id) {
            setAction(true)
        } else {
            setAction(false)
        }
        setRegularRecipe(selecteds.regular[0]?.id.toString() || "")
        setVeganRecipe(selecteds.vegan[0]?.id.toString() || "")
        setFollowRecipe(selecteds.follow || [])
    }, [selecteds])
    const verifyMenu = () => {
        if (regularRecipe === '' || veganRecipe === '' || followRecipe.length === 0) {
            toast.error('Preencha todos os campos');
            return false;
        }
        return true;
    }

    const updateMenu = async (token: string) => {
        try {
            const response = await RUAPI.updateCardapio(token, selecteds.id, {
                tipo: type,
                data: date,
                alimentos: alimentos
            })
            if (response) {
                toast.success('Cardápio atualizado com sucesso!');

            } else {
                toast.error('Erro ao atualizar cardápio')

            }
        } catch (error) {
            toast.error('Erro ao atualizar cardápio')

        }
    }

    const createMenu = async (token: string) => {
        try {
            const response = await RUAPI.postCardapio(token, {
                tipo: type,
                data: date,
                alimentos: alimentos
            })
            if (response) {
                toast.success('Cardápio cadastrado com sucesso!')
            } else {
                toast.error('Erro ao cadastrar cardápio')
            }
        } catch (error) {
            toast.error('Erro ao cadastrar cardápio')
        }
    }

    const sendMenu = async () => {
        if (!verifyMenu()) {
            return;
        }
        const token = localStorage.getItem('accessToken') || "";
        // action = true -> update
        // action = false -> create
        setIsSending(true)
        if (action) {
            updateMenu(token)
        }
        if (!action) {
            createMenu(token)
        }
        setIsSending(false)
    }

    return (
        <div className=' bg-white relative rounded-md px-10 pt-2 pb-7 gap-5 flex flex-col max-w-md w-full'
            style={{
                // drop shadow: x = 10, y = 10, blur = 10, sread = 0 rgba(0, 0, 0, 0.25)
                boxShadow: '10px 10px 10px 0px rgba(0, 0, 0, 0.25)',
            }}>
            <ToastContainer />
            <button className='absolute top-2 right-2 bg-green-500 w-10 h-10 rounded-xl' onClick={() => sendMenu()} disabled={isSending}>
                <FontAwesomeIcon icon={faCheck} className=' text-xl text-white'></FontAwesomeIcon>
            </button>
            <p className=" text-blue-500 text-2xl w-full text-center font-bold">{title}</p>
            <div className='w-full flex flex-col gap-2'>
                <p className=' underline '>Principais</p>
                <Select id={`${title.toLowerCase()}-normal`} value={regularRecipe}
                    placeholder='Refeição Normal'
                    options=
                    {
                        meal.regular.map((item) => {
                            return { value: item.id.toString(), label: item.nome_refeicao, checked: item.checked }
                        })
                    }
                    onChange={(e) => {

                        setRegularRecipe(e)
                    }} />
                <Select id={`${title.toLowerCase()}-vegan`} value={veganRecipe}
                    placeholder='Refeição Vegana'
                    options={meal.vegan.map((item) => {
                        return { value: item.id.toString(), label: item.nome_refeicao, checked: item.checked }
                    })}
                    onChange={(e) => {

                        setVeganRecipe(e)
                    }} />
            </div>

            <div className='flex flex-col gap-2'>
                <p className=' underline '>Acompanhamentos</p>
                <div className='w-full flex flex-wrap gap-5 justify-between'>
                    {
                        meal.follow.map((item) => {
                            return (
                                <div className='flex flex-row items-center gap-2' key={item.nome_refeicao + item.id.toString()}>
                                    <input type="checkbox" id={item.nome_refeicao + "_" + item.id.toString()}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setFollowRecipe([...followRecipe, item])
                                            } else {
                                                setFollowRecipe(followRecipe.filter((value) => value.id !== item.id))
                                            }
                                        }}
                                        checked={followRecipe.some((value) => value.id === item.id)}
                                    />
                                    <label htmlFor={item.nome_refeicao + item.id.toString()}>{item.nome_refeicao}</label>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}
