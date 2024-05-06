'use client';
import React from 'react'
import Image from 'next/image'
import Title from '../Title'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faX } from '@fortawesome/free-solid-svg-icons';

const SideBar = ({ controller, setController }: { controller: boolean, setController: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const CAs = [
        { id: 1, name: 'Sistemas de Informação', link: '/ca/sistemas-de-informacao' },
        { id: 2, name: 'Enfermagem', link: '/ca/enfermagem' },
        { id: 3, name: 'Medicina', link: '/ca/medicina' },
        { id: 4, name: 'Matemática', link: '/ca/matematica' },
        { id: 5, name: 'Biologia', link: '/ca/biologia' },
        { id: 6, name: 'Pedagogia', link: '/ca/pedagogia' },
    ]
    const [CaIsOpen, setCaIsOpen] = React.useState(false);

    return (
        <aside className={
            " bg-gray-800 flex flex-col justify-start items-start overflow-hidden w-0 p-0 "
        }
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 1000,
                background: '#3C3C3C',
                backgroundColor: '#3C3C3C',
                color: '#fff',
            }}>

            <div className='flex flex-col items-center justify-center cursor-pointer absolute right-4 top-11 transform -translate-y-1/2 transition-all duration-300 ease-in-out'
                onClick={() => {
                    setController(!controller);
                    let self = document.querySelector('aside');
                    self?.classList.remove('opn');
                    self?.classList.add('cls');
                }}
            >
                <FontAwesomeIcon icon={faClose} className='text-3xl'></FontAwesomeIcon>
            </div>

            <div className={'flex flex-row items-center max-[md]:justify-center gap-6 w-full  min-[md]:justify-start min-w-96'

            }>
                <div className=" rounded-full w-14 h-14 logo p-2 flex flex-row justify-center items-center"
                    style={{
                        background: "#3C3C3C",
                        backgroundColor: "#3C3C3C",
                        bottom: "-34px",
                        left: "-55px",
                        border: "2px solid #fff"
                    }}>
                    <Image src="/logo_svg.png" alt="Logo" width={40} height={40}
                        className="flex items-center justify-center" />
                </div>
                <div className=' text-sm'>
                    <Title title='UFPI News' />
                </div>
            </div>
            <nav className=' text-white flex flex-col items-start pr-16'>
                <ul className="flex flex-col items-start w-full text-white">
                    <li>
                        &#9679;<a href="/">Home</a>
                    </li>
                    <li>
                        <div className='flex  cursor-pointer items-center w-full'
                            onClick={() => {
                                setCaIsOpen(!CaIsOpen);
                            }}
                        >
                            <span className={' text-blue-600 transition-all duration-200' +
                                (CaIsOpen ? ' transform rotate-90' : '')
                            }>
                                {'►'}
                            </span>
                            <div className='pl-4 py-2  hover:underline  items-center hover:rounded-2xl w-full
                            flex flex-row justify-start
                            '
                            >
                                CAs
                            </div>

                        </div>

                        <ul className={' transition-all duration-300 ease-in-out border-l-2 border-solid border-blue-600 pl-1 ml-6 gap-0 pr-16 overflow-hidden ' + (CaIsOpen ? ' max-h-screen' : 'max-h-0')}>
                            {
                                CAs.map(ca => (
                                    <li key={ca.id} className=''>
                                        <a href={ca.link}>{ca.name}</a>
                                    </li>
                                ))
                            }
                        </ul>

                    </li>
                    <li>
                        &#9679;<a href="/sobre">Sobre</a>
                    </li>
                    <li>
                        &#9679;  <a href="/contato">Contato</a>
                    </li>
                    <li>
                        &#9679; <a href="#">Favoritos</a>
                    </li>
                </ul>
            </nav>

        </aside >
    )
}

export default SideBar