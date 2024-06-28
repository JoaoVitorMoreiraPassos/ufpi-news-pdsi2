'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import moment from 'moment-timezone';
import 'moment/locale/pt-br';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAlt } from '@fortawesome/free-solid-svg-icons';

import UserApi from '@/app/api/user';
import PostApi from '@/app/api/Notice';
import Input from '../Inputs/Input';

interface Profile {
    id: number,
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    foto_perfil: string,
    post_permissoes: boolean,
}

interface Noticia {
    id: number;
    titulo_post: string;
    autor_post: number;
    autor_post_nome: string;
    autor_imagem_post: string;
    conteudo_post: string;
    criacao: string;
    imagem_post: string;
    comentarios: [number];
}

interface Comentario {
    id: number;
    post_comentario: number;
    autor_comentario: number;
    autor_comentario_nome: string;
    imagem_autor_comentario: string;
    conteudo_comentario: string;
    criacao: string;
}

interface ComentarioResponse {
    count: number;
    next: string;
    previous: string;
    results: Array<Comentario>;
}

const NoticeContent = ({ slug }: { slug: string }) => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [data, setData] = useState('');
    const [autor, setAutor] = useState('');
    const [autor_image, setAutor_image] = useState('');
    const [timePassed, setTimePassed] = useState('');
    const [commentIds, setCommentsIds] = useState<Array<number>>([]);
    const [comments, setComments] = useState<Array<Comentario>>([]);
    const [commentsNext, setCommentsNext] = useState<string>('');
    const [comment, setComment] = useState('');
    const [user, setUser] = useState<string>();
    const [user_image, setUserImage] = useState<string>("");


    useEffect(() => {
        const getNoticia = async () => {
            try {
                if (!slug) return;
                const response: Noticia = await PostApi.GetPost(parseInt(slug[0]));
                if (!response) {
                    return;
                }
                setTitle(response.titulo_post);
                setDescription(response.conteudo_post);
                setImage(response?.imagem_post);
                setData(response.criacao);
                setAutor(response.autor_post_nome);
                setAutor_image(response?.autor_imagem_post);
                setCommentsIds(response.comentarios);
            }
            catch (error: any) {
            }
        }
        const getLoggedUser = async () => {
            if (!localStorage.getItem('acessToken')) return;
            if (!localStorage.getItem('refreshToken')) return;
            try {
                const token = localStorage.getItem('acessToken') ?? "";
                const response: Profile | undefined = await UserApi.getUser(token);
                if (!response) return;
                setUser(response.username);
                setUserImage(response.foto_perfil);
            }
            catch (error: any) {
                if (error.response.status === 401) {
                    alert('Sua sessão expirou, faça login novamente');
                    return;
                }
            }
        }
        getNoticia()
        getLoggedUser();
    }, [slug]);

    useEffect(() => {
        const getComments = async () => {
            try {
                if (!slug) return;
                const id = parseInt(slug[0]);
                const response = await PostApi.ListComments(id);
                setComments(response.results)
                setCommentsNext(response.next)
            }
            catch (error) {
            }
        }
        getComments()
    }, [commentIds, slug]);
    useEffect(() => {
        document.title = title;
    }, [title, comments]);

    useEffect(() => {
        const brazilianTimeZone = 'America/Sao_Paulo';

        const calculateTimePassed = () => {
            if (!data) return;
            if (data === '') return;
            const currentDate = moment(format(new Date(), 'yyyy-MM-dd HH:mm:ss', {
                timeZone: brazilianTimeZone,
            } as any
            ));
            const receivedDate = moment(data);

            const duration = moment.duration(currentDate.diff(receivedDate));
            const formattedTimePassed = duration.humanize();

            setTimePassed(formattedTimePassed);
        };

        calculateTimePassed();
    }, [data]);

    const handleComment = async () => {
        try {
            const token = localStorage.getItem('acessToken') ?? "";
            const user = await UserApi.getUser(token);
            if (!user) {
                document.location.href = '/autenticao/login';
                return;
            }
            const post_id = parseInt(slug[0]);
            const response: Comentario = await PostApi.CreateComment(token, {
                post_comentario: post_id,
                conteudo_comentario: comment,
                autor_comentario: user.id,
            });
            setComment('');
            const getComments = async () => {
                try {
                    if (!slug) return;
                    const id = parseInt(slug[0]);
                    const response = await PostApi.ListComments(id);
                    setComments(response.results)
                    setCommentsNext(response.next)
                }
                catch (error) {
                }
            }
            getComments()
        }
        catch (error: any) {
            if (error.response.status === 401) {
                alert('Você precisa estar logado para comentar');
                return;
            }
        }
    }

    return (
        <div className='flex flex-col justify-start items-center gap-4 pt-10 max-xl:p-4 w-full'>
            <div className=' flex flex-col justify-center items-center gap-2 p-2 w-1/2 max-xl:w-full max-xl:p-4'>
                <h1 className='text-4xl font-bold text-center'>
                    {title}
                </h1>
                <div className='text-xl h-full flex flex-col items-center justify-between w-full'>
                    <p className='w-1/2 flex justify-center text-sm'>
                        Postado há {
                            timePassed
                        }
                    </p>

                    <p className='w-1/2 text-sm h-full flex justify-center items-center'>
                        Autor(a): {autor ? autor : "Nome do usuário"}
                    </p>
                </div>
            </div>
            <div className='flex flex-col justify-start items-center  w-1/2 max-xl:w-full max-xl:p-4 '>
                {
                    !image ? (
                        <div className='flex justify-center items-center w-full h-80 bg-slate-300 rounded-lg'>
                            <p className='text-2xl font-bold text-slate-100'>
                                Sem imagem
                            </p>
                        </div>
                    ) : (
                        <Image src={image} width={1000} height={1000} alt="" className='rounded-lg w-full aspect-video' />
                    )
                }
            </div>
            <div className='flex flex-col justify-start items-start gap-4 p-2 w-1/2 max-xl:w-full max-xl:p-4'>
                <pre className='text-x text-justify text-black w-full whitespace-pre-wrap'>
                    {description}
                </pre>
            </div>

            <div className="flex flex-col justify-start items-start w-1/2 mt-6 mb-12 max-xl:w-full max-xl:p-1 gap-2">
                <p className='text-2xl font-bold w-'>
                    Comentários
                </p>
                <div className='commentContainer flex flex-col justify-start items-start w-full p-2 border-t border-b'>
                    <div className='flex flex-row justify-start items-center gap-2 w-full mb-4'>
                        {
                            !user_image ? (
                                <FontAwesomeIcon icon={faUserAlt} className="rounded-full w-4 h-4 p-2 z-10 shadow-sm border-2" width={40} height={40} />
                            ) : (
                                <Image src={user_image} className="rounded-full w-10 h-10 z-10 " width={40} height={40} alt="profile" />
                            )
                        }
                        <div className='relative flex w-full gap-2'>
                            <Input value={comment} type="text" placeholder='Adicione um comentário'
                                setValue={(value) => setComment(value)}
                                submit={handleComment}
                            />
                            <button className='bg-blue-500 text-white p-2 rounded-xl'
                                onClick={handleComment}
                            > Enviar</button>
                        </div>
                    </div>
                    <div className='w-full commentDad'>
                        {
                            comments.map((comment) => {
                                return (
                                    <div className='commentContainer flex flex-row justify-start items-center gap-2 p-2 w-full mb-1' key={comment.id}>
                                        {
                                            !comment?.imagem_autor_comentario ? (
                                                <FontAwesomeIcon icon={faUserAlt} className="rounded-full w-3 h-3 text-md p-1  z-10 shadow-sm border-2" width={40} height={40} />
                                            ) : (
                                                <Image src={comment.imagem_autor_comentario} className="rounded-full w-6 h-6 z-10 " width={40} height={40} alt="profile" />
                                            )
                                        }
                                        <div className='flex-col flex w-full justify-end'>
                                            <p className='font-bold'>
                                                {
                                                    comment.autor_comentario_nome == user ? (
                                                        <p className='font-bold'>
                                                            Você
                                                        </p>
                                                    ) : (
                                                        comment.autor_comentario_nome
                                                    )
                                                }
                                            </p>
                                            <p className='text-justify'>
                                                {comment.conteudo_comentario}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        {
                            commentsNext != '' && commentsNext != null &&
                            <button className='text-blue-500 w-56 h-10'
                                onClick={
                                    async () => {
                                        try {
                                            if (!slug) return;
                                            const response = await PostApi.ListNextComments(commentsNext);
                                            setComments([...comments, ...response.results])
                                            setCommentsNext(response.next)
                                        }
                                        catch (error) {
                                        }
                                    }}
                            >Carregar Mais...</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NoticeContent;