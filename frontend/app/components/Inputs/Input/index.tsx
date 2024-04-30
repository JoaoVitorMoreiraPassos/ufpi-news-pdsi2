'use client';
import React from 'react';
import '../style.css';

const Input = ({ type, placeholder, value, setValue, submit }: { type: string, placeholder: string, value: string, setValue: (value: string) => void, submit?: () => void }) => {

    return (
        <div className='bg-white w-full h-10 Input rounded-lg border-1 border-solid border-gray-600'>
            <input type={type} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} value={value}
                className='w-full h-full rounded-lg p-2 outline-none text-gray-900'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (submit) {
                            submit();
                        }
                    }
                }} />
        </div>
    )
}

export default Input
