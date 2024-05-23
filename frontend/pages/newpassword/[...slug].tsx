'use client';
import React from 'react'
import Image from 'next/image'
import { Fredoka } from 'next/font/google'
import Title from '@/app/components/Title';
import UserApi from '@/app/api/user';
import InputPassword from '@/app/components/Inputs/InputPassword';
import '@/app/globals.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const fredoka = Fredoka({ subsets: ['latin'] })

const Confirmar = () => {

    const [infos, setInfos] = React.useState({
        new_password: '',
        re_new_password: '',
        uid: '',
        token: ''
    })

    const validate = () => {
        if (infos.new_password === '' || infos.re_new_password === '') {
            toast.error('Preencha todos os campos!');
            return false;
        }
        if (infos.new_password !== infos.re_new_password) {
            toast.error('As senhas não coincidem!');
            return false;
        }

        const password = infos.new_password;
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

    const changePassword = async () => {
        if (validate()) {
            try {
                infos.uid = window.location.pathname.split('/')[2];
                infos.token = window.location.pathname.split('/')[3];
                await UserApi.changePassword(infos);
                toast.success('Senha alterada com sucesso!');
                setTimeout(() => {
                    window.location.pathname = "/auth/login";
                }, 2000);
            } catch (error) {
                toast.error('Erro ao alterar a senha!');
            }
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
                <Title title="Mudar Senha" />
                <div className={"gap-1 flex flex-col  " + fredoka.className}>
                    <div className=" gap-4 flex flex-col text-gray-900">
                        <div>
                            <label className='text-sm'>Nova Senha</label>
                            <InputPassword value={infos.new_password} setValue={(value) => setInfos({ ...infos, new_password: value })} submit={changePassword} />
                        </div>
                        <div>
                            <label className='text-sm'>Confirmar Nova Senha</label>
                            <InputPassword value={infos.re_new_password} setValue={(value) => setInfos({ ...infos, re_new_password: value })} submit={changePassword} />
                        </div>
                    </div>
                </div>

                <div className=" flex items-center justify-center">
                    <button className={"text-white rounded-full w-3/4 " + fredoka.className}
                        style={{
                            background: "#4C84F2",
                            fontSize: "1.4rem",
                            fontWeight: "500",
                        }}
                        onClick={() => { changePassword() }}
                    >
                        Confirmar Mudança
                    </button>
                </div>
            </div>
        </main >
    )
}

export default Confirmar