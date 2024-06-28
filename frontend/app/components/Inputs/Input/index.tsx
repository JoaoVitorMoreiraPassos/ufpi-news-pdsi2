'use client';
import React from 'react';
import '../style.css';

const Input = ({ id, type, placeholder, value, list, setValue, submit }: { id?: string, type: string, placeholder: string, value: string, list?: string, setValue: (value: string) => void, submit?: () => void }) => {

    return (
        <div className='bg-white w-full h-10 Input rounded-lg border-1 border-solid border-gray-600'>
            <input id={id ? id : ''} type={type} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} value={value}
                className='w-full h-full rounded-lg p-2 outline-none text-gray-900'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (submit) {
                            submit();
                        }
                    }
                }}
                list={list ? list : ''} />
        </div>
    )
}

export default Input
