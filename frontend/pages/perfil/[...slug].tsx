import React from 'react'
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenRegister } from '../../app/components/OpenRegister';
import { Inter } from 'next/font/google';
import SideBar from '../../app/components/SideBar';
import Header from '../../app/components/Header';
import NoticesContainer from '../../app/components/NoticesContainer';
import Footer from '../../app/components/Footer';
import { useState } from 'react';
import UserApi from '../../app/api/user';
import { faPenToSquare, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import '@/app/globals.css'
import { Fredoka } from 'next/font/google';


const inter = Inter({ subsets: ["latin"] });
const fredoka = Fredoka({ subsets: ["latin"] });

const Perfil = () => {

    const [sideBarControl, setSideBarControl] = useState(false);
    const [isUserLogged, setIsUserLogged] = useState(false);
    const [visitedUser, setVisitedUser] = useState({
        username: '',
        first_name: '',
        last_name: '',
        foto_perfil: '',
        permissions: [false, false]
    });
    const [loggedUser, setLoggedUser] = useState({
        name: '',
        avatar: '',
        email: '',
        permissions: [false, false]
    });

    React.useEffect(() => {

        const verify = async () => {
            try {
                const response = await UserApi.verifyToken(localStorage.getItem('acessToken') ?? '');
                return response;
            } catch (error) {
                return false;
            }
        }
        verify().then((response) => {
            if (response) {
                (visitedUser);
                (loggedUser)
                if (!visitedUser.username) {
                    return
                }
                if (!loggedUser.name) {
                    return
                }
                if (visitedUser.username === loggedUser.name) {
                    setIsUserLogged(true);
                }
            } else {
                localStorage.removeItem('acessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                setIsUserLogged(false);
            }
        })
    }, [loggedUser, visitedUser]);

    React.useEffect(() => {

        const getVisitedUser = async () => {
            const username = window.location.pathname.split('/')[2];
            try {
                const response = await UserApi.searchUser(username);
                visitedUser.username = response.username;
                visitedUser.first_name = response.first_name;
                visitedUser.last_name = response.last_name;
                visitedUser.foto_perfil = response.foto_perfil;
                visitedUser.permissions = [response.post_permissoes, response.refeicao_permissoes];
            } catch (error) {
                (error);
            }

        }
        const getLoggedUser = async () => {
            try {
                const infos = localStorage.getItem('user');
                if (infos) {
                    const user = JSON.parse(infos);
                    (user);
                    setLoggedUser(user);
                }
            } catch {
                console.log('Erro ao buscar usuário logado');
            }
        }
        getVisitedUser();
        getLoggedUser();

    }, []);

    const [screenWidth, setScreenWidth] = useState<number>(0);
    React.useEffect(() => {
        setScreenWidth(window.innerWidth);
        window.addEventListener("resize", () => {
            setScreenWidth(window.innerWidth);
        });
    }, []);
    return (
        <div className={inter.className}>
            <div className="my-container">

                <div className="relative w-full">
                    <SideBar controller={sideBarControl} setController={setSideBarControl} />
                    <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                    <main className="flex min-h-screen px-0 pt-0 mt-16">
                        <section className="w-full min-[sm]:px-8 pb-4 flex flex-row flex-wrap gap-4 justify-center">

                            <div className="flex flex-col justify-end items-start w-full h-auto p-20 pb-0 relative">
                                <div className="absolute top-0 left-0 w-full h-full bg-gray-400 z-0"></div>
                                {/* Adicionar background do perfil */}
                                {/* {
                                !profile?.background_image ?
                                    :
                                    <Image className="absolute top-0 left-0 w-full h-full object-cover z-0" width={1920} height={554} src={profile?.background_image} alt="background" />
                            } */}
                                <div className={" flex flex-row items-center max-xl:items-center w-full z-10 max-md:flex-col h-44"}>
                                    {
                                        !visitedUser.foto_perfil ?
                                            <FontAwesomeIcon className="rounded-full w-20 h-20 p-14 z-10 bg-slate-300 text-white text-sm" icon={faUserAlt} />
                                            :
                                            <Image className="rounded-full w-40 h-40 z-10" width={1000} height={1000} src={visitedUser.foto_perfil} alt="profile" />
                                    }
                                    <p className={"text-3xl text-left text-gray-800 bottom-8 opacity-100 z-10 pt-4 pl-6 max-md:pl-0 " + fredoka.className}
                                        style={{
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {visitedUser.first_name + visitedUser.last_name ? visitedUser.first_name + " " + visitedUser.last_name : visitedUser.username}
                                    </p>
                                    <div className='w-full absolute bottom-0 left-0 h-28 z-0'
                                        style={
                                            {
                                                backgroundColor: "#DDD"
                                            }
                                        }>
                                    </div>
                                    {
                                        isUserLogged &&
                                        <Link href="/perfil/editar-perfil">
                                            <FontAwesomeIcon className="absolute bottom-16 right-2 w-6 h-6 p-2 text-lg text-gray-800 rounded-full cursor-pointer" icon={faPenToSquare} />
                                        </Link>
                                    }
                                </div>
                            </div>

                        </section>

                        {
                            visitedUser.permissions[0] == true && (
                                <section className="w-full py-32 px-44 max-md:px-4 max-sm:px-0">
                                    <NoticesContainer title="Notícias Publicadas" />
                                </section>
                            )
                        }

                    </main>
                </div>
                <Footer />
            </div>
            <OpenRegister />
        </div>
    )
}

export default Perfil