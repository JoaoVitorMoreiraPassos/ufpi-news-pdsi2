import React from 'react'
import { Fredoka } from 'next/font/google'
import './style.css'

const fredoka = Fredoka({ subsets: ['latin'] })

const Title = ({ title }: { title: string }) => {
    return (
        <div className={"flex items-center justify-center relative " + fredoka.className}
            style={{
                fontWeight: "bold",
            }}
        >
            <span className='titleBe'
            >&lt;</span>
            <span
                className=' titleM'
            >
                {title}
            </span>
            <span className='titleBe'>/&gt;</span>
        </div>
    )
}

export default Title