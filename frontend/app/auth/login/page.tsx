'use client';
import Image from "next/image";
import InputPassword from "@/app/components/Inputs/InputPassword";
import Input from "@/app/components/Inputs/Input";
import React from "react";
import { Fredoka } from "next/font/google";
import UserApi from "@/app/api/user";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/Title";
import { useEffect } from "react";

const fredoka = Fredoka({ subsets: ["latin"] });

export default function Login() {
    useEffect(() => {
        document.title = 'Login';
    }, [])
    const [infos, setInfos] = React.useState({
        username: '',
        password: '',
    });

    const validate = () => {
        if (infos.username === '' || infos.password === '') {
            toast.error('Preencha todos os campos!');
            return false;
        }
        return true;
    }
    const saveInfos = async () => {
        const accessToken = localStorage.getItem('accessToken') ?? '';
        try {
            const response = await UserApi.getUser(accessToken);
            const infos = {
                name: response.username,
                email: response.email,
                avatar: response.foto_perfil,
                permissions: [response.post_permissoes, response.refeicao_permissoes]

            }
            localStorage.setItem('user', JSON.stringify(infos));
        } catch (error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.pathname = '/auth/login';
        }
    }
    const login = async () => {
        if (validate()) {
            try {
                const response = await UserApi.login(infos);
                localStorage.setItem('accessToken', response.access);
                localStorage.setItem('refreshToken', response.refresh);
                await saveInfos();
                toast.success('Login efetuado com sucesso!');
                setTimeout(() => {
                    window.location.pathname = "/";
                }, 1000);
            } catch (error) {
                toast.error('Usuário ou senha inválidos!');
            }
        }
    }

    return (
        <main className="flex flex-col items-center justify-center relative">
            <ToastContainer />
            <div className="flex flex-col w-auto h-auto m-auto bg-white rounded-3xl p-7 gap-8 relative pt-16"
                style={
                    {
                        border: "2px solid #B7B5B5",
                        boxShadow: "-10px 20px 15px 0px rgba(0,0,0,0.25)"
                    }
                }>
                <div className=" rounded-full w-28 h-28 absolute logo p-2 flex justify-center items-center"
                    style={{
                        background: "#3C3C3C",
                        backgroundColor: "#3C3C3C",
                        top: "-60px",
                        left: "calc(50% - 56px)",
                        border: "1px solid #B7B5B5"
                    }}>
                    <Image src="/logo_svg.png" alt="Logo" width={70} height={70}
                        className="flex items-center justify-center" />
                </div>
                <div className=" text-gray-800">
                    <Title title="Faça Login" />
                </div>
                <div className="gap-1 flex flex-col">
                    <div className=" gap-4 flex flex-col">
                        <Input type="text" placeholder="Usuário" value={infos.username} setValue={(value) => setInfos({ ...infos, username: value })} submit={login} />
                        <InputPassword value={infos.password} setValue={(value) => setInfos({ ...infos, password: value })} submit={login} />
                    </div>
                    <div className="flex flex-row justify-end h-4">
                        <a href="/auth/recover"
                            style={
                                {
                                    color: "#3B82F6",
                                    fontSize: "0.75rem"
                                }
                            }>Esqueceu sua senha?</a>
                    </div>
                </div>

                <div className=" flex items-center justify-center">
                    <button className={"text-white rounded-full w-3/4 " + fredoka.className}
                        style={{
                            background: "#4C84F2",
                            fontSize: "1.5rem",
                            fontWeight: "500",
                        }}
                        onClick={login}
                    >Entrar</button>
                </div>

                <div className="flex flex-colum items-center justify-center gap-1 flex-wrap"
                    style={
                        { fontSize: "0.75rem" }
                    }>
                    <span className=" text-gray-500">Não tem uma conta?</span>
                    <a href="/auth/register" style={
                        {
                            color: "#3B82F6"
                        }
                    }>Cadastre-se aqui.</a>
                </div>
            </div>
        </main >
    );
}
