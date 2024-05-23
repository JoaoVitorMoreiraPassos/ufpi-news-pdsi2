'use client';
import React from 'react'
import Title from '../Title'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import UserApi from '../../api/user';
import './style.css'

const Header = ({ SideBarController, setSideBarController }: { SideBarController: boolean, setSideBarController: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [user, setUser] = React.useState({
        name: '',
        email: '',
        avatar: '',
        permissions: [false, false]
    });

    const [isLogged, setIsLogged] = React.useState(false)
    const [slidePosition, setSlidePosition] = React.useState('first');
    const [userOptions, setUserOptions] = React.useState(false);
    const logout = () => {
        localStorage.removeItem('acessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.pathname = '/';
    }
    React.useEffect(() => {
        const verify = async () => {
            try {
                const response = await UserApi.verifyToken(localStorage.getItem('acessToken') ?? '');
                return response;
            } catch (error) {
                return false;
            }
        }
        const path = window.location.pathname;
        if (path === '/') {
            setSlidePosition('first');
        }
        if (path === '/sobre') {
            setSlidePosition('second');
        }
        if (path === '/contato') {
            setSlidePosition('third');
        }

        const userInfos = localStorage.getItem('user');
        if (userInfos) {
            const user = JSON.parse(userInfos);
            setUser(user);

            verify().then((response) => {
                if (response) {
                    setIsLogged(true);
                } else {
                    localStorage.removeItem('acessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    setIsLogged(false);
                }
            })
        }
        document.addEventListener('click', (e) => {
            if (e.target !== document.querySelector('.userOptions') && e.target !== document.querySelector('.openOptions')
                && e.target !== document.querySelector('.openOptions svg') && e.target !== document.querySelector('.openOptions path')
                && e.target !== document.querySelector('.openOptions2')
            ) {
                setUserOptions(false);
            }
        })
    }, [])
    React.useEffect(() => {
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('header nav ul li a');

        switch (slidePosition) {
            case 'first':
                links[0]?.classList.add('text-blue-500');
                links[1]?.classList.remove('text-blue-500');
                links[2]?.classList.remove('text-blue-500');
                break;
            case 'second':
                links[1]?.classList.add('text-blue-500');
                links[0]?.classList.remove('text-blue-500');
                links[2]?.classList.remove('text-blue-500');

                break;
            case 'third':
                links[2]?.classList.add('text-blue-500');
                links[0]?.classList.remove('text-blue-500');
                links[1]?.classList.remove('text-blue-500');

                break;
            default:
                break;
        }

    }, [slidePosition])

    const moveSlideToOrigin = () => {
        const path = window.location.pathname;
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('header nav ul li a');
        if (path === '/') {
            setSlidePosition('first');
            links[0]?.classList.add('text-blue-500');

        }
        if (path === '/sobre') {
            setSlidePosition('second');
            links[1]?.classList.add('text-blue-500');

        }
        if (path === '/contato') {
            setSlidePosition('third');
            links[2]?.classList.add('text-blue-500');
        }
    }

    return (
        <header className=' flex flex-row items-center w-full fixed z-50'>
            <div className='hamburguer flex flex-col items-center justify-center cursor-pointer absolute top-1/2 transform -translate-y-1/2 transition-all duration-300 ease-in-out'
                onClick={() => {
                    setSideBarController(!SideBarController)
                    let sideBar = document.querySelector('aside');
                    sideBar?.classList.remove('cls');
                    sideBar?.classList.remove('w-0');
                    sideBar?.classList.remove('p-0');
                    sideBar?.classList.add('opn');
                }}
            >
                <div className='bg-white w-8 h-1 rounded-full'></div>
                <div className='bg-white w-8 h-1 rounded-full mt-1'></div>
                <div className='bg-white w-8 h-1 rounded-full mt-1'></div>
            </div>
            <a href="/" className='headerLogo flex flex-row items-center gap-4 text-white relative' >
                <Title title='UFPI News' />
                <div className=" rounded-full w-14 h-14 absolute logo p-2 flex justify-center items-center"
                    style={{
                        background: "#3C3C3C",
                        backgroundColor: "#3C3C3C",
                        bottom: "-34px",
                        left: "-55px",
                        border: "2px solid #fff"
                    }}>
                    <Image src="/logo_svg.png" alt="Logo" width={40} height={40}
                        className="flex items-center justify-center w-10 h-10" />
                </div>
            </a>
            <nav className='text-white relative'>
                <ul className='flex flex-row transition-all duration-300'>
                    <li
                        onMouseMove={() => setSlidePosition("first")}
                        onMouseLeave={() => moveSlideToOrigin()}
                    ><a className='transition-all duration-300 ease-in-out'
                        href="/">Home</a></li>
                    <li
                        onMouseMove={() => setSlidePosition("second")}
                        onMouseLeave={() => moveSlideToOrigin()}
                    ><a className='transition-all duration-300 ease-in-out'
                        href="/sobre">Sobre</a></li>
                    <li
                        onMouseMove={() => setSlidePosition("third")}
                        onMouseLeave={() => moveSlideToOrigin()}
                    ><a className='transition-all duration-300 ease-in-out'
                        href="/contato">Contato</a></li>
                    <li className=' cursor-pointer'>
                        <div className='bdr h-1/2'></div>
                        <div className='gap-3 flex items-center ml-5 w-6 h-6 relative '
                            onClick={
                                () => setUserOptions(!userOptions)
                            }>
                            {
                                user.avatar ? (
                                    <Image src={user.avatar} alt="Usuário" width={20} height={20}
                                        className="rounded-full w-full h-full openOptions"
                                        onClick={
                                            () => setUserOptions(!userOptions)
                                        }
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUserAlt} style={{
                                        color: '#fff',
                                        background: '#D2D2D2',
                                        borderRadius: '50%',
                                        padding: '7px'
                                    }} className='h-full w-full openOptions'
                                        onClick={
                                            () => setUserOptions(!userOptions)
                                        } />
                                )
                            }
                            <span
                                className=' openOptions2'
                                onClick={
                                    () => setUserOptions(!userOptions)
                                }
                            >{
                                    user.name ? user.name : ''
                                }</span>
                            <div className={"flex justify-center w-36 userOptions absolute  bg-white rounded-3xl py-4 shadow-lg transition-all duration-400 ease-in-out " +
                                (userOptions ? "block + top-16" : " -top-36") + " z-10"
                            }
                                style={{
                                    right: '-4.2rem'
                                }}
                            >
                                <div className='h-2 w-4 bg-white absolute -top-2 left-16'
                                    style={
                                        {
                                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                                        }
                                    }></div>
                                {
                                    isLogged ? (
                                        <ul className="flex flex-col gap-2 w-full items-center">
                                            <li className='text-blue-500 h-8 flex items-center justify-center w-full'>
                                                <a href={"/perfil/" + user.name}>
                                                    Minha conta
                                                </a>
                                            </li>
                                            <li className='text-blue-500 h-8 flex items-center justify-center border-t-2 pt-3 w-full'>
                                                <button
                                                    onClick={logout}
                                                >Sair</button>
                                            </li>

                                        </ul>
                                    ) : (
                                        <ul className="flex flex-col gap-2">
                                            <li className='text-blue-500 h-8 flex items-center justify-center'>
                                                <a href="/auth/login">
                                                    Entrar
                                                </a>
                                            </li>
                                            <li className='text-blue-500 h-8 flex items-center justify-center border-t-2 pt-3'>
                                                <a href="/auth/register">
                                                    Cadastrar
                                                </a>
                                            </li>

                                        </ul>
                                    )
                                }
                            </div>
                        </div>
                    </li>
                </ul>
                <div className={'slideBar w-1/5 bg-blue-500 h-2 absolute bottom-0 ' + slidePosition + ' transition-all duration-300 ease-in-out'}
                    style={
                        {
                            borderRadius: '0px 5px 0px 5px'
                        }
                    }
                >
                </div>
            </nav >

        </header >
    )
}

export default Header