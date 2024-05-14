import { faPlay } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import InputSearch from '../Inputs/InputSearch'
import Carousel from '../Carousel'
import CardNotice from '../CardNotice'

const NoticesContainer = ({ title }: { title: string }) => {

    const item = {
        image: "https://via.placeholder.com/350x250",
        title: "Title",
        content: "Content",
        url: "https://www.google.com",
        date: "2021-10-10",
    }

    return (
        <div className='w-full max-sm:px-4 '>
            <div className='flex flex-row gap-4 w-full h-full max-sm:flex-col justify-between'>
                <div className="flex flex-row items-center gap-2 justify-self-start">
                    <FontAwesomeIcon className="w-4 h-4" icon={faPlay} style={{
                        color: "#4C84F2",
                    }} />
                    <h1 className='text-xl'>{title}</h1>
                </div>
                <div >
                    <InputSearch />
                </div>
            </div>
            <div>
                <Carousel>
                    <CardNotice data={item} />
                    <CardNotice data={item} />
                    <CardNotice data={item} />
                    <CardNotice data={item} />
                    <CardNotice data={item} />
                    <CardNotice data={item} />
                </Carousel>
            </div>
        </div>
    )
}

export default NoticesContainer