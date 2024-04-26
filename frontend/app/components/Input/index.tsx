'use client';
import React from 'react';

const Input = ({ type, placeholder, value, setValue }: { type: string, placeholder: string, value: string, setValue: (value: string) => void }) => {

    return (
        <div className='bg-white w-full h-10 passwordInput rounded-lg border-1 border-solid border-gray-600'>
            <input type={type} placeholder={placeholder} onChange={(e) => setValue(e.target.value)} value={value}
                className='w-full h-full rounded-lg p-2 outline-none text-gray-900' />
        </div>
    )
}

export default Input
