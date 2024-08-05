'use client';
import React from 'react'
import Image from 'next/image'
import Title from '../Title'
import './style.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlay, faHouse, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import UserApi from '@/app/api/user';
import Input from '@/app/components/Inputs/Input';
import { userInfo } from 'os';

const SideBar = ({ controller, setController }: { controller: boolean, setController: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const CAs = [
        { id: 1, name: 'Sistemas de Informação', link: '/perfil/casi' },
        // { id: 2, name: 'Enfermagem', link: '/ca/enfermagem' },
        // { id: 3, name: 'Medicina', link: '/ca/medicina' },
        // { id: 4, name: 'Matemática', link: '/ca/matematica' },
        // { id: 5, name: 'Biologia', link: '/ca/biologia' },
        // { id: 6, name: 'Pedagogia', link: '/ca/pedagogia' },
    ]
    const [CaIsOpen, setCaIsOpen] = React.useState(false);
    const [loggedUser, setLoggedUser] = React.useState({
        name: '',
        avatar: '',
        email: '',
        permissions: [false, false]
    });

    React.useEffect(() => {
        const userInfos = localStorage.getItem('user');
        if (userInfos) {
            const user = JSON.parse(userInfos);
            setLoggedUser(user);
        }
    }, []);

    const [user_to_search, setUserToSearch] = React.useState<string>('');
    const [isOnSearch, setIsOnSearch] = React.useState<boolean>(false);
    const [search_results, setSearchResults] = React.useState<any[]>([]);


    const openCloseSideBar = () => {
        const sideBar = document.querySelector('.sideBar');
        const hamburguerMenu = document.querySelector('.hamburguerMenu');

        if (sideBar) {
            sideBar.classList.add('close');
            sideBar.classList.remove('open');
        };
        if (hamburguerMenu) {
            hamburguerMenu.classList.remove('hidden');
            hamburguerMenu.classList.add('flex');
            document.querySelector('.mainContainer')?.classList.remove('border-l');
        };
    }

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

            <a className={'flex flex-row items-center max-[md]:justify-center gap-6 w-full  min-[md]:justify-start min-w-96'
            } href='/'>
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
            </a>
            <nav className=' text-white flex flex-col items-start pr-16'>
                <ul className="flex flex-col items-start w-full text-white">
                    <li className='flex gap-1 justify-center items-center ' key='search_user'>
                        <Input value={user_to_search} setValue={setUserToSearch} id={"search_users_id"} type="text" placeholder="Pesquisar usuário" onFocusSet={
                            setIsOnSearch}
                            onKDown={(e) => {
                                if (e.key == 'Escape') {
                                    setUserToSearch('');
                                }

                                if (user_to_search == '' || user_to_search == " ") {
                                    setSearchResults([]);

                                }
                                else if (user_to_search.length < 1) {
                                    setSearchResults([]);
                                }

                                else {
                                    const getSearchResults = async () => {
                                        try {
                                            const response = await UserApi.SearchUsers(user_to_search);
                                            setSearchResults(response.results);
                                        } catch (error) {
                                            console
                                        }
                                    }
                                    getSearchResults();
                                }
                            }}
                        ></Input>
                        {/* <input value={user_to_search} id={"search_users_id"} type="text" placeholder="Pesquisar usuário" className="border rounded-md h-12 w-100 pl-4 max-md:text-center " onFocus={
                            (e) => {
                                setIsOnSearch(true);
                            }
                        } onChange={
                            (e) => {

                                setUserToSearch(e.target.value)
                                if (e.target.value == '') {
                                    setSearchResults([]);
                                } else {
                                    const getSearchResults = async () => {
                                        try {
                                            const response = await UserApi.SearchUsers(e.target.value);
                                            setSearchResults(response.results);
                                        } catch (error) {
                                            console
                                        }
                                    }
                                    getSearchResults();
                                }
                            }
                        }
                            onBlur={() =>
                                setTimeout(() => {
                                    setIsOnSearch(false);
                                }, 500)}
                        /> */}

                    </li>


                    {/* {
                        !isOnSearch &&
                        menu_options.map((option, index) => {
                            return (
                                <li key={"side_menu_option_" + option.id} className=' border-t flex gap-1 items-center h-14' >
                                    <Link href={option.link} className='py-3' onClick={openCloseSideBar}>
                                        <i className='px-3 w-10'>
                                            {option.icon}
                                        </i>
                                        <span className='w-100'>
                                            {option.name}
                                        </span>
                                    </Link>
                                </li>
                            )
                        })
                    } */}
                    {
                        isOnSearch &&
                        search_results.map((result, index) => {
                            return (
                                <li key={"side_menu_option_" + result.id} className=' border-t flex gap-1 items-center h-14 transition-all duration-500 ease-in-out hover:bg-gray-100'>
                                    <button onClick={() => window.location.pathname = `/perfil/${result.username}`} className='py-3 flex items-center w-full h-full'>
                                        {result.foto_perfil == null ?
                                            <i className='px-3 w-10'>
                                                <FontAwesomeIcon icon={faUserAlt} />
                                            </i>
                                            :
                                            <Image src={result.foto_perfil} alt={result.username} width={20} height={20} className='mx-2 w-auto h-full rounded-full aspect-square' />
                                        }
                                        <span className='w-100'>
                                            {result.username}
                                        </span>
                                    </button>
                                </li>
                            )
                        })
                    }
                    <li>
                        &#9679;<a href="/">Home</a>
                    </li>
                    {
                        loggedUser.name == "joao" &&
                        <li>
                            &#9679;<a href="/taks/">Atividades {
                                loggedUser.name == "joao" ? "(Beta)" : ""
                            }</a>
                        </li>
                    }
                    <li>
                        <div className='flex  cursor-pointer items-center w-full'
                            onClick={() => {
                                setCaIsOpen(!CaIsOpen);
                            }}
                        >
                            <span className={' text-blue-600 transition-all duration-300' +
                                (CaIsOpen ? ' transform rotate-90' : '')
                            }>
                                <FontAwesomeIcon icon={faPlay} className='text-blue-600'></FontAwesomeIcon>
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

                    <li className=''>
                        &#9679; {
                            loggedUser.name ? (
                                <a href={"/perfil/" + loggedUser.name}>Perfil</a>
                            ) : (
                                <a href="/auth/login">Entrar</a>
                            )
                        }
                    </li>
                    {
                        loggedUser.name &&
                        <li className=''>
                            &#9679; <a onClick={() => {
                                localStorage.removeItem('user');
                                localStorage.removeItem('acessToken');
                                localStorage.removeItem('refreshToken');
                                window.location.href = '/';
                            }}>Sair</a>
                        </li>
                    }
                </ul>
            </nav>

        </aside >
    )
}

export default SideBar