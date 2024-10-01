import React from 'react'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComment, faHeart, faMessage } from '@fortawesome/free-solid-svg-icons'
import 'moment/locale/pt-br'
import moment from 'moment-timezone'
import { format } from 'date-fns'
import { FormatOptions } from 'date-fns';
import NoticeAPI from '../../api/Notice';

const CardNotice = ({ data, favorite }: {
    data:
    {
        id: number,
        imagem_post: string,
        titulo_post: string,
        conteudo_post: string,
        url: string,
        criacao: string,
        atualizacao: string,
        ativo: boolean,
        autor_post_nome: string
    }, favorite: boolean
}) => {
    const [timePassed, setTimePassed] = React.useState<string>('');
    const [isFavorite, setIsFavorite] = React.useState<boolean>(favorite);
    const [text, setText] = React.useState<string>(favorite ? 'text-red-500' : 'text-gray-500');
    React.useEffect(() => {
        const brazilianTimeZone = 'America/Sao_Paulo';
        const currentDate = moment(format(new Date(), 'yyyy-MM-dd HH:mm:ss', {
            timeZone: brazilianTimeZone
        } as FormatOptions

        ));
        const receivedDate = moment(data.criacao);

        const duration = moment.duration(currentDate.diff(receivedDate));
        const formattedTimePassed = duration.humanize();

        setTimePassed(formattedTimePassed);
    }, [data]);

    React.useEffect(() => {
        if (isFavorite) {
            setText('text-red-500');
        } else {
            setText('text-gray-500');
        }
    }, [isFavorite]);

    return (
        <div className=' card flex flex-col gap-4 justify-between items-center min-w-72 w-72 h-full bg-white'
            style={{
                borderRadius: "2.5rem 0 2.5rem 0",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                border: "1px solid #B7B5B5",
                minHeight: "400px",
            }}
        >
            <div className=' h-44 w-full'
                style={{
                    borderRadius: "2.5rem 0 0 0",
                }}
            >
                {
                    data.imagem_post === "" &&
                    <div className='flex justify-center items-center h-full'>
                        <h1>Imagem não disponível</h1>
                    </div>
                }
                {
                    data.imagem_post !== null &&
                    <>
                        <Image className='w-full aspect-video' width={150} height={150} src={data.imagem_post} alt='Imagem indisponível'
                            style={{
                                borderRadius: "2.5rem 0 0 0",
                            }}
                        ></Image>
                    </>
                }
            </div>
            <div
                className='h-44 w-full px-6 flex flex-col gap-2'
            >
                <h1 className=' text-center w-full'
                    style={{
                        color: "#3C3C3C"
                    }}
                >
                    {data.titulo_post}
                </h1>
                <p className='w-full border-l-4 border-blue-500 border-solid h-auto pl-2 max-h-32'
                    style={{
                        fontWeight: 300,
                        color: "#787878",
                        fontSize: "0.85rem",
                        textAlign: "justify",
                    }}>
                    {data.conteudo_post.substring(0, 130) + "..."}
                </p>
            </div>
            <div
                className=' h-14 flex flex-row justify-between items-center w-full pl-4 pr-6 pb-1'
            >
                <div style={{
                    fontSize: "0.7rem",
                    color: "#B7B5B5",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",

                }}>
                    <p>
                        Postado há {timePassed}
                    </p>
                    <p className='flex gap-3 items-center'>

                        <FontAwesomeIcon icon={faHeart} className={text + ' w-4 h-4 cursor-pointer transition-all duration-300 ease-in-out'}
                            onClick={async (e) => {
                                if (isFavorite) {
                                    try {
                                        const token = localStorage.getItem('accessToken') ?? "";
                                        const response = await NoticeAPI.DeleteFavoritePosts(token, data.id);
                                        if (!response) return;
                                        if (response == null) return;
                                        if (response == undefined) return;
                                        setIsFavorite(false);
                                    } catch (error: any) {
                                        if (error.response.status === 401) {
                                            window.location.href = '/auth/login';
                                            return;
                                        }
                                    }
                                } else {
                                    try {
                                        const token = localStorage.getItem('accessToken') ?? "";
                                        const response = await NoticeAPI.CreateFavoritePosts(token, data.id);
                                        if (!response) return;
                                        if (response == null) return;
                                        if (response == undefined) return;
                                        setIsFavorite(true);
                                    } catch (error: any) {
                                        if (error.response.status === 401) {
                                            window.location.href = '/auth/login';
                                            return;
                                        }

                                    }
                                }
                            }}
                            style={{
                                fontSize: "1rem",
                            }}>
                        </FontAwesomeIcon>
                        <p className='cursor-pointer underline text-blue-500 text-sm'
                            onClick={() => {
                                window.location.pathname = `/perfil/${data.autor_post_nome}`
                            }}
                        >{data.autor_post_nome}</p>
                    </p>
                </div>
                <div className='h-full flex items-center'>
                    <a href={`/noticias/${data.id}`}>
                        <button className=' transition-all duration-200 border-2 border-solid border-blue-500 text-blue-500 rounded-md px-3 hover:text-white hover:bg-blue-500'
                            style={{
                                fontSize: "1rem",
                                fontWeight: "300"
                            }}>
                            Mais...
                        </button>
                    </a>
                </div>
            </div>
        </div >
    )
}

export default CardNotice;