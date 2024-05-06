import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faFacebook } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import './style.css'

const Footer = () => {
    return (
        <footer className='flex justify-around items-center self-end w-full relative text-xl'
            style={{
                height: 'auto',
                minHeight: '180px',
                background: '#3C3C3C',
                backgroundColor: '#3C3C3C',
                color: '#fff'
            }}>
            <div className=" rounded-full w-14 h-14 logo p-2 flex justify-center items-center"
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

            <div>
                <ul>
                    <li>
                        <a href="/">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/sobre">
                            Sobre
                        </a>
                    </li>
                    <li>
                        <a href="/contato">
                            Contato
                        </a>
                    </li>
                </ul>
            </div>

            <div>
                <ul>
                    <li>
                        <a href="#">
                            Politica de Privacidade
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            Termos de Uso
                        </a>
                    </li>
                </ul>
            </div>

            <div className='flex flex-row justify-center'>
                <ul className='flex flex-row text-2xl justify-center items-center w-36 gap-4'>
                    <li>
                        <a href="">
                            <FontAwesomeIcon icon={faGithub}></FontAwesomeIcon>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <FontAwesomeIcon icon={faInstagram}></FontAwesomeIcon>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <FontAwesomeIcon icon={faFacebook}></FontAwesomeIcon>
                        </a>
                    </li>
                    <li>
                        <a href="">
                            <FontAwesomeIcon icon={faWhatsapp}></FontAwesomeIcon>
                        </a>
                    </li>
                </ul>
            </div>

        </footer>
    )
}

export default Footer