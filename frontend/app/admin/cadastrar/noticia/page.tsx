'use client';
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SideBar from "../../../components/SideBar";
import UserAPI from "../../../api/user";
import React from "react";
import Input from "@/app/components/Inputs/Input";
import { toast, ToastContainer } from 'react-toastify';
import './style.css';
import NoticesAPI from "../../../api/Notice";

export default function Home() {

    const [sideBarControl, setSideBarControl] = React.useState(false);
    const [validUser, setValidUser] = React.useState(false);
    const [postInfos, setPostInfos] = React.useState<{ imagem_post: File, titulo_post: string, conteudo_post: string }>({
        imagem_post: new File([], ''),
        titulo_post: "",
        conteudo_post: "",
    });

    const verifyForm = () => {
        if (!postInfos.imagem_post) {
            toast.error('Insira uma imagem');
            return false;
        }
        if (!postInfos.titulo_post) {
            toast.error('Insira um título');
            return false;
        }
        if (!postInfos.conteudo_post) {
            toast.error('Insira um conteúdo');
            return false;
        }
        return true;
    }

    const handleSubmit = async () => {
        if (!verifyForm()) {
            return;
        }
        try {
            const token = localStorage.getItem('acessToken') ?? '';
            const response = await NoticesAPI.CreatePost(token, postInfos);
            if (response) {
                toast.success('Postagem criada com sucesso');
            }
        }
        catch (err) {
            toast.error('Erro ao criar postagem');
        }
    }

    React.useEffect(() => {
        const loggedUser = localStorage.getItem('user') ?? {};
        if (!loggedUser) {
            window.location.href = '/auth/login';
        }
        const token = localStorage.getItem('acessToken') ?? '';
        const verifyToken = async (token: string) => {
            try {
                const response = await UserAPI.verifyToken(token);
                console.log(response)
                if (!response) {
                    window.location.href = '/auth/login';
                }
                setValidUser(true);
            }
            catch (err) {
                window.location.href = '/auth/login';
            }
        }
        verifyToken(token);
        const verifyUser = async (token: string) => {
            try {
                const response = await UserAPI.getUser(token);
                console.log(response)
                if (!response) {
                    window.location.href = '/auth/login';
                }
                if (!response.post_permissoes) {
                    window.location.href = '/auth/login';
                }
                setValidUser(true);
            }
            catch (err) {
                window.location.href = '/auth/login';
            }
        }
        verifyUser(token);
    }, [])

    return (
        <div className="my-container">
            <ToastContainer />
            <div className="relative w-full">
                <SideBar controller={sideBarControl} setController={setSideBarControl} />
                <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />
                <main className="flex min-h-screen max-sm:px-0">
                    {
                        validUser &&
                        <div className="w-full">

                            <div className="flex flex-col gap-4 justify-between items-center w-full h-full bg-white pb-4"
                                style={{
                                    borderRadius: "2.5rem 0 2.5rem 0",
                                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                                    border: "1px solid #B7B5B5",
                                    minHeight: "400px",
                                }}
                            >
                                <div className="flex flex-col w-96 gap-4 justify-end items-start h-full pt-8 pb-4">
                                    {/* <p className=' w-full text-left'>Imagem</p> */}
                                    <label htmlFor="image" className="drop-container h-full w-full flex justify-center items-center" id="dropcontainer"
                                        onDragOver={
                                            (e) => {
                                                e.preventDefault();
                                            }
                                        }
                                        onDragEnter={() => {
                                            let dropcontainer = document.querySelector('.dropcontainer')
                                            if (dropcontainer) {
                                                dropcontainer.classList.add("drag-active")
                                            }
                                        }}
                                        onDragLeave={() => {
                                            let dropcontainer = document.querySelector('.dropcontainer')
                                            if (dropcontainer) {
                                                dropcontainer.classList.remove("drag-active")
                                            }
                                        }}
                                        onDrop={async (e) => {
                                            let dropContainer = document.querySelector('.dropcontainer');
                                            let fileInput = document.querySelector('#image') as HTMLInputElement;

                                            e.preventDefault();
                                            if (dropContainer) {
                                                dropContainer.classList.remove("drag-active");
                                            }
                                            if (fileInput) {
                                                const file = e.dataTransfer.files[0];
                                                const dataUrl = await new Promise<string>((resolve, reject) => {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => resolve(reader.result as string);
                                                    reader.onerror = reject;
                                                    reader.readAsDataURL(file);
                                                });
                                                const response = await fetch(dataUrl);
                                                const blob = await response.blob();
                                                const convertedFile = new File([blob], file.name, { type: file.type });
                                                setPostInfos({ ...postInfos, imagem_post: convertedFile });
                                            }
                                        }}
                                    >
                                        <span className="drop-title">Arraste a imagem aqui<br /></span>
                                        ou
                                        <input
                                            type="file"
                                            name="image"
                                            id="image"
                                            className="w-full flex justify-center items-center text-center"
                                            placeholder="Arrate uma imagem até aqui"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setPostInfos({ ...postInfos, imagem_post: e.target.files[0] });
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <div
                                    className=" w-full px-6 flex flex-col gap-2"
                                >
                                    <Input type={"text"} placeholder="Título" value={postInfos.titulo_post} setValue={(value) => setPostInfos({ ...postInfos, titulo_post: value })} />
                                    <textarea value={postInfos.conteudo_post} placeholder="Conteúdo" className="w-full h-80 rounded-xl px-2 py-2 outline-none Input"
                                        onChange={(e) => setPostInfos({ ...postInfos, conteudo_post: e.target.value })}
                                        style={{
                                            resize: "none",
                                            fontWeight: "300",
                                            fontSize: "14px",
                                        }}
                                    ></textarea>
                                </div>
                                <div className="w-full flex justify-end px-6">
                                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
                                        onClick={() => handleSubmit()}
                                    >Cadastrar</button>
                                </div>
                            </div>
                        </div>
                    }
                </main>
            </div>
            <Footer />
        </div >
    );
}
