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
    const [slideShow, setSlideShow] = React.useState(false);
    const [slidePosition, setSlidePosition] = React.useState('first');
    const [userOptions, setUserOptions] = React.useState(false);
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setUser({
            name: '',
            email: '',
            avatar: '',
            permissions: [false, false]
        });
        window.location.pathname = '/';

    }
    React.useEffect(() => {
        const verify = async () => {
            try {
                const response = await UserApi.verifyToken(localStorage.getItem('accessToken') ?? '');

                const user = await UserApi.getUser(localStorage.getItem('accessToken') ?? '');

                setUser({
                    name: user.username,
                    email: user.email,
                    avatar: user.foto_perfil,
                    permissions: user.permissions
                })

                return response;
            } catch (error) {
                return false;
            }
        }

        const userInfos = localStorage.getItem('user');
        if (userInfos) {
            const user = JSON.parse(userInfos);
            setUser(user);

            verify().then((response) => {
                if (response) {
                    setIsLogged(true);
                } else {
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('user');
                    setUser({
                        name: '',
                        email: '',
                        avatar: '',
                        permissions: [false, false]
                    });
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


    const moveSlideToOrigin = () => {
        if (!slideShow) {
            return;
        }
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
        <header className=' flex flex-row items-center  w-full fixed z-30'>
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
                    <li className=' cursor-pointer'>
                        <div className='bdr h-1/2'></div>
                        <div className='gap-3 flex items-center ml-5 w-6 h-6 relative '
                            onClick={
                                () => setUserOptions(!userOptions)
                            }>
                            {
                                user.avatar ? (
                                    <Image src={user.avatar} alt="Usuário" width={100} height={100}
                                        style={{
                                            color: '#fff',
                                            background: '#D2D2D2',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            maxWidth: '50px',
                                            // padding: '7px'
                                        }}
                                        className="openOptions"
                                        onClick={
                                            () => setUserOptions(!userOptions)
                                        }
                                    />
                                ) : (
                                    <FontAwesomeIcon icon={faUserAlt} style={{
                                        color: '#fff',
                                        background: '#D2D2D2',
                                        borderRadius: '50%',
                                        padding: '10px',
                                        width: '20px',
                                        height: '20px',
                                        fontSize: '1rem'
                                    }} className=' openOptions'
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
                                    user.name ? user.name.substring(0, 10) : ''
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

            </nav >

        </header >
    )
}

export default Header