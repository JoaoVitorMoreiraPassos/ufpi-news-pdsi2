'use client';
import Image from "next/image";
import InputPassword from "@/app/components/InputPassword";
import Input from "@/app/components/Input";
import React from "react";
import './style.css';
import { Fredoka } from "next/font/google";

const fredoka = Fredoka({ subsets: ["latin"] });

export default function Home() {

    const [infos, setInfos] = React.useState({
        user: '',
        password: '',
    });

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative ">
            <div className="flex flex-col w-auto h-auto m-auto bg-slate-50 rounded-3xl p-7 gap-8 relative pt-16"
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
                <div className={"flex items-center justify-center relative " + fredoka.className}
                    style={{
                        fontWeight: "bold",
                        color: "#3C3C3C"
                    }}
                >
                    <span style={
                        {
                            fontSize: "2.3rem",
                            fontWeight: "bold",
                            color: "#4C84F2",

                        }
                    }>&lt;</span>
                    <span
                        style={
                            {
                                fontSize: "2.5rem",
                            }
                        }
                    >Faça Login</span>
                    <span style={
                        {
                            fontSize: "2.3rem",
                            fontWeight: "bold",
                            color: "#4C84F2",
                        }
                    }>/&gt;</span>
                </div>
                <div className="gap-1 flex flex-col">
                    <div className=" gap-4 flex flex-col">
                        <Input type="text" placeholder="Usuário" value={infos.user} setValue={(value) => setInfos({ ...infos, user: value })} />
                        <InputPassword value={infos.password} setValue={(value) => setInfos({ ...infos, password: value })} />
                    </div>
                    <div className="flex flex-row justify-end h-4">
                        <a href=""
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
                    >Entrar</button>
                </div>

                <div className="flex flex-colum items-center justify-center gap-1"
                    style={
                        { fontSize: "0.75rem" }
                    }>
                    <span className=" text-gray-500">Não tem uma conta?</span>
                    <a href="/auth/register"
                        style={
                            { color: "#3B82F6" }

                        }>Cadastre-se aqui.</a>
                </div>
            </div>
        </main >
    );
}
