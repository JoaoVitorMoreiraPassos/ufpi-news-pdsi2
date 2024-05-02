'use client';
import React from 'react'
import Image from 'next/image'
import Input from '@/app/components/Inputs/Input'
import { Fredoka } from 'next/font/google'
import Title from '@/app/components/Title';
import UserApi from '@/app/api/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fredoka = Fredoka({ subsets: ['latin'] })

const Recover = () => {

    const [infos, setInfos] = React.useState({
        email: '',
    })

    const [isSending, setIsSending] = React.useState(false)
    const [status, setStatus] = React.useState('Enviando...')

    React.useEffect(() => {
        if (isSending) {
            const interval = setInterval(() => {
                setStatus((prev: string) => {
                    if (prev.length === 8) {
                        return 'Enviando.'
                    }
                    if (prev.length === 9) {
                        return 'Enviando..'
                    }
                    if (prev.length === 10) {
                        return 'Enviando...'
                    }
                    if (prev.length === 11) {
                        return 'Enviando'
                    }
                    return prev;
                })
            }, 300)

            return () => clearInterval(interval)
        }

    }, [isSending]);
    const validate = () => {
        if (infos.email === '') {
            toast.error('Preencha todos os campos!');
            return false;
        }
        return true;
    }

    const sendEmail = async () => {
        if (validate()) {
            setIsSending(true);
            try {
                await UserApi.recoverPassword(infos);
                toast.success('Email enviado com sucesso! Por favor verifique seu email!');
                let input: HTMLInputElement | null = document.querySelector('input[type="email"]');
                if (input) {
                    input.value = '';
                }
            } catch (error) {
                toast.error('Erro ao enviar email!');
            }
            setIsSending(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative ">
            <ToastContainer />
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
                <div className=' text-gray-800'>
                    <Title title="Recuperar Senha" />
                </div>
                <div className="gap-1 flex flex-col">
                    <div className=" gap-4 flex flex-col">
                        <Input type="email" placeholder="Email" value={infos.email} setValue={(value) => setInfos({ ...infos, email: value })} submit={sendEmail} />
                    </div>
                </div>

                {
                    !isSending ? (
                        <div className=" flex items-center justify-center">
                            <button className={"text-white rounded-full w-3/4 " + fredoka.className}
                                style={{
                                    background: "#4C84F2",
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                }}
                                onClick={sendEmail}
                            >
                                Enviar Email
                            </button>
                        </div>) : (
                        <div className=" flex items-center justify-center">
                            <button className={"text-white rounded-full w-3/4 " + fredoka.className}
                                style={{
                                    background: "#CCCCCC",
                                    fontSize: "1.5rem",
                                    fontWeight: "500",
                                    cursor: "not-allowed",
                                    transition: "all 0.3s"
                                }}
                                onClick={() => { }}
                            >
                                {status}
                            </button>
                        </div>
                    )}
            </div>
        </main >
    )
}

export default Recover