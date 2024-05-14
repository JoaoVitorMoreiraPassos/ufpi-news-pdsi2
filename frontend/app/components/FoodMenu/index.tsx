'use client';
import Image from "next/image";
import React from 'react'

const FoodMenu = ({ meal, data }: { meal: string, data: string[] }) => {
    return (
        <div className="transition-all duration-200 refeicao flex flex-row bg-white rounded-3xl min-w-72 justify-start h-full w-96"
            style={{
                border: " 4px solid #B7B5B5",
                boxShadow: "-5px 4px 10px 0 rgba(0, 0, 0, 0.25)",
            }}
        >
            <div className="flex justify-center items-center">

                <Image src="/frango empanada 1.png" alt="food" width={200} height={200}
                    className=" h-36 w-36  contain-content aspect-square flex justify-center items-center "
                />
            </div>
            <div className="p-2 w-auto h-full max-sm:pr-0">
                <h1 className="text-xl font-bold text-gray-800">
                    {meal}
                </h1>
                <ul className=" h-full border-l-4 pl-1 border-blue-500 flex flex-col justify-between flex-wrap w-full">
                    {
                        data.map((item, index) => {
                            return <li
                                className="overflow-hidden  overflow-ellipsis w-full "
                                style={{
                                    fontSize: "clamp(.7rem, 1.5vw, .8rem)",
                                    wordBreak: "break-word",
                                }}
                                key={index}>
                                {item}
                            </li>
                        })
                    }
                </ul>
            </div>
        </div >
    )
}

export default FoodMenu