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
import { time } from "console";

const fredoka = Fredoka({ subsets: ["latin"] });

export default function Register() {

    const [infos, setInfos] = React.useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
    });

    const validate = () => {
        if (infos.first_name === '' || infos.last_name == '' || infos.username === '' || infos.email === '' || infos.password === '') {
            return false;
        }
        const email = infos.email;
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            toast.error('Email inválido!');
            let input: HTMLInputElement | null = document.querySelector('input[type="email"]');
            if (input) {
                input.focus();
            }
            return false;
        }
        // validate password
        const password = infos.password;
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!passwordRegex.test(password)) {
            toast.error('A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula e um número!');
            let input: HTMLInputElement | null = document.querySelector('input[type="password"]');
            if (input) {
                input.focus();
            }
            return false;
        }

        return true;
    }


    const register = async () => {
        if (validate()) {
            try {
                await UserApi.register(infos);
                toast.success('Usuário cadastrado com sucesso!');
                setTimeout(() => {
                    window.location.pathname = "/auth/login";
                }, 2000);
                window.location.pathname = "/auth/login";
            } catch (error) {
                toast.error('Erro ao cadastrar usuário!');
            }
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative ">
            <ToastContainer />
            <div className="flex flex-col w-auto h-auto m-auto bg-slate-50 rounded-3xl p-7 gap-8 relative pt-16 min-w-72"
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
                    <Title title="Bem-Vindo" />
                </div>
                <div className="gap-1 flex flex-col">
                    <div className=" gap-4 flex flex-col">
                        <div className="flex flex-row gap-1">
                            <Input type="text" placeholder="Nome" value={infos.first_name} setValue={(value) => setInfos({ ...infos, first_name: value })} submit={register} />
                            <Input type="text" placeholder="Sobrenome" value={infos.last_name} setValue={(value) => setInfos({ ...infos, last_name: value })} submit={register} />

                        </div>
                        <Input type="text" placeholder="Usuário" value={infos.username} setValue={(value) => setInfos({ ...infos, username: value })} submit={register} />
                        <Input type="email" placeholder="Email" value={infos.email} setValue={(value) => setInfos({ ...infos, email: value })} submit={register} />
                        <InputPassword value={infos.password} setValue={(value) => setInfos({ ...infos, password: value })} submit={register} />
                    </div>
                </div>

                <div className=" flex items-center justify-center">
                    <button className={"text-white rounded-full w-3/4 " + fredoka.className}
                        style={{
                            background: "#4C84F2",
                            fontSize: "1.5rem",
                            fontWeight: "500",
                        }}
                        onClick={register}
                    >
                        Cadastrar
                    </button>
                </div>

                <div className="flex flex-colum items-center justify-center gap-1 flex-wrap"
                    style={
                        { fontSize: "0.75rem" }
                    }>
                    <span className=" text-gray-500">Já possui uma conta?</span>
                    <a href="/auth/login"
                        style={
                            { color: "#3B82F6" }

                        }>Entre aqui.</a>
                </div>
            </div>
        </main >
    );
}
