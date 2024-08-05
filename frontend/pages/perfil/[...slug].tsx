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
import NoticesAPI from "@/app/api/Notice";
import { faAngleLeft, faCamera, faClose, faPenToSquare, faPlay, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import '@/app/globals.css'
import { Fredoka } from 'next/font/google';
import { EditModal } from '@/app/components/EditModal';
import Input from '@/app/components/Inputs/Input';
import { BeautifulImageDropzone } from '@/app/components/ImageModal';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


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
    const [editModal, setEditModal] = useState(false);
    const [imageModal, setImageModal] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [nome, setNome] = useState('');
    const [sobrenome, setSobrenome] = useState('');
    const [posts, setPosts] = useState<any[]>([]);
    const [next, setNext] = useState('');
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [favoritePosts, setFavoritePosts] = useState<any[]>([]);
    const [nextFavoritePosts, setNextFavoritePosts] = useState('');
    const [loadingFavoritePosts, setLoadingFavoritePosts] = useState(false);


    React.useEffect(() => {

        const verify = async () => {
            try {
                const token = localStorage.getItem('accessToken') ?? '';
                if (!token) {
                    return false;
                }
                const response = await UserApi.verifyToken(token);
                return response;
            } catch (error) {
                console.log('Erro ao verificar token');
                return false;
            }
        }
        verify().then((response) => {
            if (response) {
                if (!visitedUser.username) {
                    return
                }
                if (!loggedUser.name) {
                    return
                }
            } else {
                localStorage.removeItem('accessToken');
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
                setVisitedUser({
                    username: response.username,
                    first_name: response.first_name,
                    last_name: response.last_name,
                    foto_perfil: response.foto_perfil,
                    permissions: [response.post_permissoes, response.refeicao_permissoes]
                });

                // visitedUser.username = response.username;
                // visitedUser.first_name = response.first_name;
                // visitedUser.last_name = response.last_name;
                // visitedUser.foto_perfil = response.foto_perfil;
                // visitedUser.permissions = [response.post_permissoes, response.refeicao_permissoes];
            } catch (error) {
                console.log('Erro ao buscar usuário visitado');
            }
        }
        const getLoggedUser = async () => {
            try {
                const infos = localStorage.getItem('user');
                if (infos) {
                    const user = JSON.parse(infos);
                    setLoggedUser(user);
                }
            } catch {
                console.log('Erro ao buscar usuário logado');
            }
            try {
                const token = localStorage.getItem('accessToken') ?? '';
                const response = await UserApi.getUser(token);
                setNome(response.first_name);
                setSobrenome(response.last_name);
                setImage(response.foto_perfil);
            } catch {
                console.log('Erro ao buscar usuário logado');
            }
        }
        getVisitedUser();
        getLoggedUser();
    }, []);

    React.useEffect(() => {
        if (visitedUser.username === loggedUser.name) {
            setIsUserLogged(true);
        }

        const getNotices = async () => {
            setLoadingPosts(true);
            try {
                const username = window.location.pathname.split('/')[2];
                const response = await NoticesAPI.searchPostsByUser(username);
                setNext(response.next);
                setPosts(response.results);


            } catch (error) {
                console.log('Erro ao buscar posts do usuário');
            }
            setLoadingPosts(false);
        }

        getNotices()
    }, [visitedUser.username]);
    React.useEffect(() => {
        const getFavorites = async () => {
            setLoadingFavoritePosts(true);
            try {
                const token = localStorage.getItem('accessToken') ?? '';
                const response = await NoticesAPI.ListFavoritePosts(token);
                setNextFavoritePosts(response.next);
                setFavoritePosts(response.results);
            } catch {
                console.log('Erro ao buscar posts favoritos');
            }
            setLoadingFavoritePosts(false);
        }
        if (isUserLogged && visitedUser.username !== '' && loggedUser.name !== '' && visitedUser.username === loggedUser.name) {

            getFavorites();
        }
    }, [isUserLogged, visitedUser.username, loggedUser.name]);
    return (
        <div className={inter.className}>
            <ToastContainer />
            {
                editModal &&
                <>
                    <EditModal imgModal={imageModal}>

                        <button className='absolute top-2 right-2 z-50 rounded-full bg-blue-500 flex items-center justify-center' onClick={() => {
                            setEditModal(false);
                            setImageModal(false);
                            setImage(null);
                        }}>
                            <FontAwesomeIcon className=" w-6 h-6 p-2 text-white rounded-full cursor-pointer" icon={faClose} />
                        </button>
                        <div className='flex flex-col gap-4 items-center justify-start pt-10'>
                            <div className="flex flex-row items-center gap-2 justify-self-start w-full">
                                <FontAwesomeIcon className="w-4 h-4" icon={faPlay} style={{
                                    color: "#4C84F2",
                                }} />
                                <h1 className='text-xl'>Editar</h1>
                            </div>
                            <div className='rounded-full relative overflow-hidden w-28 h-28 p-0 flex items-center justify-center'>
                                {
                                    !image ?
                                        <FontAwesomeIcon className="rounded-full w-20 h-20 p-20  bg-slate-300 text-white text-sm" icon={faUserAlt} />
                                        :
                                        <Image className="rounded-full w-28 h-28 " width={1000} height={1000} src={image} alt="profile" />
                                }
                                <button className='absolute bottom-0 right-0 left-0 flex justify-center items-center bg-gray-500 mx-auto opacity-0 hover:opacity-60 transition-all duration-300 ease-in-out'
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%'
                                    }}
                                    onClick={() => setImageModal(true)}
                                >
                                    <FontAwesomeIcon className=" w-6 h-6 p-2 text-lg text-gray-800 rounded-full cursor-pointer" icon={faCamera} />
                                </button>
                            </div>
                            <Input type="text" placeholder='Nome' value={nome} setValue={(value) => setNome(value)} />
                            <Input type="text" placeholder='Sobrenome' value={sobrenome} setValue={(value) => setSobrenome(value)} />
                            <button className='bg-blue-500 text-white p-2 rounded-full' onClick={async () => {
                                try {
                                    const token = localStorage.getItem('accessToken') ?? '';
                                    const response = await UserApi.updateProfile({
                                        username: loggedUser.name,
                                        first_name: nome,
                                        last_name: sobrenome,
                                        foto_perfil: imageFile
                                    }, token);
                                    if (!response) toast.error('Erro ao atualizar perfil');
                                    if (response == null) toast.error('Erro ao atualizar perfil');
                                    if (response == undefined) toast.error('Erro ao atualizar perfil');
                                    toast.success('Perfil atualizado com sucesso');
                                } catch {
                                    console.log('Erro ao atualizar perfil');
                                }
                                setEditModal(false);
                            }}>Salvar</button>
                        </div>

                    </EditModal>
                    {
                        imageModal &&
                        <BeautifulImageDropzone image={image} setImage={setImage} imageFile={imageFile} setFile={setImageFile} close={setImageModal}>
                            <button className='absolute top-2 right-2 z-50 rounded-full bg-blue-500 flex items-center justify-center' onClick={() => setImageModal(false)}>
                                <FontAwesomeIcon className=" w-6 h-6 p-2 text-white rounded-full cursor-pointer" icon={faAngleLeft} />
                            </button>
                        </BeautifulImageDropzone>
                    }
                </>
            }
            <div className="my-container">

                <div className="relative w-full">
                    <SideBar controller={sideBarControl} setController={setSideBarControl} />
                    <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                    <main className="flex min-h-screen px-0 pt-0 mt-16">
                        <section className="w-full min-[sm]:px-8 pb-0 flex flex-row flex-wrap gap-4 justify-center mb-20">

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
                                    <p className={"text-3xl max-sm:w-full md:text-left max-md:text-center text-gray-800 bottom-8 opacity-100 z-10 pt-4 pl-6 max-md:pl-0 " + fredoka.className}
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: "clamp(1.5rem, 3vw, 1.5rem)",
                                            width: "100vw"
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
                                        isUserLogged && visitedUser.username !== '' && loggedUser.name !== '' && visitedUser.username === loggedUser.name &&
                                        <button onClick={() => setEditModal(true)}>
                                            <FontAwesomeIcon className="absolute bottom-16 right-2 w-6 h-6 p-2 text-lg text-gray-800 rounded-full cursor-pointer" icon={faPenToSquare} />
                                        </button>
                                    }

                                </div>
                            </div>

                        </section>

                        {
                            isUserLogged && visitedUser.username !== '' && loggedUser.name !== '' && visitedUser.username === loggedUser.name &&
                            <section className="w-full px-44 max-md:px-4 max-sm:px-0">
                                <NoticesContainer title="Seus Favoritos" noticesList={favoritePosts} nextNotices={nextFavoritePosts} loading={loadingFavoritePosts} searchBar={false} />
                            </section>
                        }

                        <section className="w-full px-44 max-md:px-4 max-sm:px-0">
                            <NoticesContainer title="Notícias Publicadas" noticesList={posts} nextNotices={next} loading={loadingPosts} />
                        </section>


                    </main>

                </div>
                <Footer />
            </div>
            <OpenRegister />
        </div>
    )
}

export default Perfil


