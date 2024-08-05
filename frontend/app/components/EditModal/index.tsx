import React from 'react'

export const EditModal = ({ children, imgModal }: { children: React.ReactNode, imgModal: boolean }) => {
    return (
        <div className='fixed w-full h-full z-40 flex justify-center items-center bg-black bg-opacity-80'>
            <div className='relative bg-white md:rounded-xl max-w-screen-lg md:w-5/6 md:h-4/5 max-md:w-full max-md:h-full p-8 flex flex-col justify-start items-center gap-4 pt-4'
            >
                {children}

            </div>

        </div >
    )
}
