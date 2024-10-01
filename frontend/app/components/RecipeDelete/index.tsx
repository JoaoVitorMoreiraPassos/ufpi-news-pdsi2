'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import RUAPI from '@/app/api/Recipe'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
interface Item {
    id: number,
    nome_refeicao: string,
    tipo_refeicao: string
}

const RecipeDelete: React.FC<{ item: Item }> = ({ item }) => {

    const deleteItem = async () => {
        try {
            const token = localStorage.getItem('accessToken') ?? "";
            const response = await RUAPI.deleteAlimento(token, item.id);

            const node = document.querySelector(`#${item.tipo_refeicao}${item.id}`)
            if (node) {
                if (node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            }
        } catch {
            toast.error('Erro ao deletar item')
        }
    }

    return (
        <div key={item.id} id={item.tipo_refeicao + item.id} className='flex flex-row justify-between items-center w-80  border-b-2 border-solid p-1' >
            <ToastContainer />
            <p>{item.nome_refeicao}</p>
            <button className=' text-red-500 rounded-xl p-2 text-xl flex items-center justify-center' onClick={
                () => {
                    deleteItem()
                }
            }><i><FontAwesomeIcon icon={faTrash} /></i></button>
        </div >
    )
}

export default RecipeDelete

