import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faMessage } from '@fortawesome/free-solid-svg-icons'


const CardNotice = ({ data }: {
    data:
    {
        image: string,
        title: string,
        content: string,
        url: string,
        date: string,
    }
}) => {
    return (
        <div className='flex flex-col gap-4 justify-between items-center min-w-72 w-72 h-96 bg-white'
            style={{
                borderRadius: "2.5rem 0 2.5rem 0",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                border: "1px solid #B7B5B5",
            }}
        >
            <div className=' h-44 w-full'
                style={{
                    borderRadius: "2.5rem 0 0 0",
                }}
            >
                <Image src={data.image} width={150} height={150} alt=''
                    className='w-full aspect-video'
                    style={{
                        borderTopLeftRadius: "2.5rem",
                    }}
                />
            </div>
            <div
                className='h-44 w-full px-6 flex flex-col gap-2'
            >
                <h1 className=' text-center w-full'>
                    {data.title}
                </h1>
                <p className='w-full border-l-4 border-blue-500 border-solid h-auto pl-2'
                    style={{
                        fontWeight: 300,
                        color: "#2787878",
                        fontSize: "0.85rem",
                    }}>
                    {data.content}
                </p>
            </div>
            <div
                className=' h-14 flex flex-row justify-between items-center w-full pl-4 pr-6 pb-1'
            >
                <div style={{
                    fontSize: "0.7rem",
                    color: "#B7B5B5",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",

                }}>
                    <p>
                        tempo de postagem
                    </p>
                    <p className='flex gap-2 items-center'>
                        <FontAwesomeIcon icon={faMessage} className='text-gray-400'
                            style={{
                                fontSize: "1rem",
                            }}>
                        </FontAwesomeIcon>
                        X comentários
                    </p>
                </div>
                <div className='h-full flex items-center'>
                    <a href={data.url}>
                        <button className=' transition-all duration-200 border-2 border-solid border-blue-500 text-blue-500 rounded-md px-3 hover:text-white hover:bg-blue-500'
                            style={{
                                fontSize: "1rem",

                            }}>
                            Mais...
                        </button>
                    </a>
                </div>
            </div>
        </div >
    )
}

export default CardNotice;