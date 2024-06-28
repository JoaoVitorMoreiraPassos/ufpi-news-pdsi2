import { faChevronRight, faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import InputSearch from '../Inputs/InputSearch'
import Carousel from '../Carousel'
import CardNotice from '../CardNotice'
import NoticesApi from '../../api/Notice'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { faChevronCircleRight } from '@fortawesome/free-solid-svg-icons/faChevronCircleRight'
import CircularProgress from '@mui/material/CircularProgress';
import { get } from 'http'



const NoticesContainer = ({ title }: { title: string }) => {

    const [notices, setNotices] = React.useState<any[]>([])
    const [next, setNext] = React.useState("")
    const [loading, setLoading] = React.useState(true)
    const [username, setUsername] = React.useState('')


    const getNotices = async () => {

        try {
            ("username " + username)
            if (username) {
                const response = await NoticesApi.searchPostsByUser(username)
                setNext(response.next)
                setNotices(response.results)
                setLoading(false)
                return
            }
            const response = await NoticesApi.ListPost()
            setNext(response.next)
            setNotices(response.results)
            setLoading(false)

        }
        catch (error) {
            toast.error('Ops! Erro ao carregar noticias')
            setLoading(false)
        }
        setLoading(false)
    }

    const getNextNotices = async () => {
        if (!next) return;
        try {
            const response = await NoticesApi.ListNextPosts(next)
            setNotices([...notices, ...response.results])
            setNext(response.next)
        } catch {
            toast.error('Ops! Erro ao carregar noticias')
        }
    }

    React.useEffect(() => {
        const init = () => {
            try {
                setUsername(window.location.pathname.split('/')[2])
            } catch {
                setUsername('')
            }
        }

        init()
    }, [])

    React.useEffect(() => {
        getNotices()
    }, [username])

    return (
        <div className='w-full max-sm:px-4 '>
            <ToastContainer />
            <div className='flex flex-row gap-4 w-full h-full max-sm:flex-col justify-between'>
                <div className="flex flex-row items-center gap-2 justify-self-start">
                    <FontAwesomeIcon className="w-4 h-4" icon={faPlay} style={{
                        color: "#4C84F2",
                    }} />
                    <h1 className='text-xl'>{title}</h1>
                </div>
                <div className='flex justify-center'>
                    <InputSearch />
                </div>
            </div>
            <div>
                {
                    notices && notices.length === 0 && !loading && (
                        <div className='flex justify-center items-center h-24'>
                            <h1>Nenhuma notícia encontrada</h1>
                        </div>
                    )
                }
                {
                    loading && (
                        <div className='flex justify-center items-center h-24'>
                            <CircularProgress />
                        </div>
                    )
                }
                {
                    notices && notices.length > 0 &&
                    <Carousel>
                        {
                            notices.map((notice, index) => {
                                return (
                                    <CardNotice key={index} data={notice} />
                                )
                            })
                        }
                        {
                            next && !loading &&
                            <div className='flex justify-center items-center h-24'>
                                <button onClick={getNextNotices} className='bg-blue-500 text-white rounded-full p-2 flex items-center justify-center'>
                                    <FontAwesomeIcon icon={faChevronRight} className='w-10 h-10 flex items-center justify-center' />
                                </button>
                            </div>
                        }
                    </Carousel>
                }
            </div>
        </div>
    )
}

export default NoticesContainer