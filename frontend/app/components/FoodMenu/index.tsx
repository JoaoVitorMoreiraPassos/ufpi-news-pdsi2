'use client';
import Image from "next/image";
import React from 'react'
type Alimento = {
    id: number
    nome_refeicao: string
    tipo_refeicao: string
    ativo: boolean
    tipo_refeicao_nome: string
}
const FoodMenu = ({ meal, data }: { meal: string, data: Alimento[] }) => {

    const [normal, setNormal] = React.useState<Alimento[]>([]);
    const [vegan, setVegan] = React.useState<Alimento[]>([]);
    const [follow, setFollow] = React.useState<Alimento[]>([]);

    React.useEffect(() => {
        const regular = data.filter(item => item.tipo_refeicao === 'N');
        const vegan = data.filter(item => item.tipo_refeicao === 'V');
        const follow = data.filter(item => item.tipo_refeicao === 'A');
        setNormal(regular);
        setVegan(vegan);
        setFollow(follow);
    }, [data]);

    return (
        <div className="relative transition-all duration-200 refeicao flex flex-row bg-white rounded-3xl min-w-72 justify-start h-full w-96"
            style={{
                border: " 4px solid #B7B5B5",
                boxShadow: "-5px 4px 10px 0 rgba(0, 0, 0, 0.25)",
            }}
        >
            <div className="absolute flex justify-center items-center left-2 top-2">

                {/* <Image src="/frango empanada 1.png" alt="food" width={200} height={200}
                    className=" h-36 w-36  contain-content aspect-square flex justify-center items-center "
                /> */}
                <div className=" h-full flex justify-center items-start  rounded-2xl">
                    <Image src="/rulogo.jpg" alt="food" width={35} height={35} className="rounded-full"></Image>
                </div>
            </div>
            <div className="p-2 w-auto h-full max-sm:pr-0 flex flex-wrap  gap-4 justify-center">
                <h1 className="text-xl font-bold text-gray-800">
                    <p className=" underline">
                        {meal}
                    </p>
                </h1>
                <ul className=" h-full  pl-1  w-full grid grid-cols-2 gap-3">
                    <li className="border-l-2 border-blue-500 pl-4 ">
                        <h5 className="text-lg font-semibold">Normal</h5>
                        <p> {normal.length === 0 ? "Nenhum alimento cadastrado" : normal[0].nome_refeicao}</p>
                    </li>
                    <li className="border-l-2 border-blue-500 pl-4 ">
                        <h5 className="text-lg font-semibold">Vegano</h5>
                        <p> {vegan.length === 0 ? "Nenhum alimento cadastrado" : vegan[0].nome_refeicao}</p>
                    </li>
                    {
                        follow.length > 0 &&
                        <li className="border-l-2 border-blue-500 pl-4 col-span-2 justify-center">
                            <h5 className="text-lg font-semibold">Acompanhamento</h5>
                            <ul>
                                {
                                    follow.map((item, index) => {
                                        return <li
                                            className="overflow-hidden  overflow-ellipsis w-full "
                                            style={{
                                                // fontSize: "clamp(.7rem, 1.5vw, .8rem)",
                                                wordBreak: "break-word",
                                            }}
                                            key={index}>
                                            {item?.nome_refeicao}
                                        </li>
                                    })
                                }
                            </ul>
                        </li>


                    }
                    {/* {
                        data.map((item, index) => {
                            return <li
                                className="overflow-hidden  overflow-ellipsis w-full "
                                style={{
                                    fontSize: "clamp(.7rem, 1.5vw, .8rem)",
                                    wordBreak: "break-word",
                                }}
                                key={index}>
                                {item?.nome_refeicao}
                            </li>
                        })
                    } */}
                </ul>
            </div>
        </div >
    )
}

export default FoodMenu