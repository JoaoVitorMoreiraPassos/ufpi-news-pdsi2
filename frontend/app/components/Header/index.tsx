'use client';
import React from 'react'
import Title from '../Title'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';
import UserApi from '../../api/user';
import './style.css'

const Header = () => {

    const [user, setUser] = React.useState({
        name: '',
        email: '',
        avatar: '',
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
        if (path === '/contato') {
            setSlidePosition('second');
        }
        if (path === '/sobre') {
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
    }, [])
    React.useEffect(() => {
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('nav ul li a');

        switch (slidePosition) {
            case 'first':
                links[0].classList.add('text-blue-500');
                links[1].classList.remove('text-blue-500');
                links[2].classList.remove('text-blue-500');
                break;
            case 'second':
                links[1].classList.add('text-blue-500');
                links[0].classList.remove('text-blue-500');
                links[2].classList.remove('text-blue-500');
                break;
            case 'third':
                links[2].classList.add('text-blue-500');
                links[0].classList.remove('text-blue-500');
                links[1].classList.remove('text-blue-500');
                break;
            default:
                break;
        }

    }, [slidePosition])
    const moveSlideToOrigin = () => {
        const path = window.location.pathname;
        const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('nav ul li a');
        if (path === '/') {
            setSlidePosition('first');
            links[0].classList.add('text-blue-500');
        }
        if (path === '/contato') {
            setSlidePosition('second');
            links[1].classList.add('text-blue-500');
        }
        if (path === '/sobre') {
            setSlidePosition('third');
            links[2].classList.add('text-blue-500');
        }
    }

    return (
        <div className='HeaderContainer flex flex-row items-center justify-between w-full px-28 relative
        '
            style={{
                height: '70px',
                background: '#3C3C3C',
                backgroundColor: '#3C3C3C',
            }}>

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
                        className="flex items-center justify-center" />
                </div>
            </a>
            <nav className='text-white relative'>
                <ul className='flex flex-row gap-4 transition-all duration-300'>
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
                        <div className='gap-3 flex items-center pl-5'
                            onClick={
                                () => setUserOptions(!userOptions)
                            }>
                            <span>{
                                user.name ? user.name : 'Usuário'
                            }</span>
                            {
                                user.avatar ? (
                                    <Image src={user.avatar} alt="Usuário" width={20} height={20} />
                                ) : (
                                    <FontAwesomeIcon icon={faUserAlt} style={{
                                        color: '#fff',
                                        background: '#D2D2D2',
                                        borderRadius: '50%',
                                        padding: '7px'
                                    }} />
                                )
                            }
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
            <div className={"userOptions absolute right-20 bg-white rounded-3xl p-4 shadow-lg transition-all duration-400 ease-in-out " +
                (userOptions ? "block + top-16" : " -top-28") + " z-10"
            }>
                {
                    isLogged ? (
                        <ul className="flex flex-col gap-2">
                            <li className='text-blue-500 h-8 flex items-center justify-center'>
                                <a href="/perfil/">
                                    Minha conta
                                </a>
                            </li>
                            <li className='text-blue-500 h-8 flex items-center justify-center border-t-2 pt-3'>
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
        </div >
    )
}

export default Header