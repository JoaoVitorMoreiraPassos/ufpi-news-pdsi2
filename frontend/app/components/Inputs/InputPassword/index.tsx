'use client';
import React from 'react';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../style.css';


export default function InputPassword({ value, setValue, submit }: { value: string, setValue: (value: string) => void, submit?: () => void }) {

    const [showPassword, setShowPassword] = React.useState(false);

    return (
        <div className="flex flex-row w-full bg-white h-10 Input rounded-lg border-1 border-solid border-gray-600">
            <input type={showPassword ? 'text' : 'password'} value={value} onChange={(e) => setValue(e.target.value)}
                className='bg-transparent w-11/12 h-full outline-none px-2 text-black' placeholder='Senha'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        if (submit) {
                            submit();
                        }
                    }
                }} />
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} onClick={() => setShowPassword(!showPassword)}
                className='flex items-center justify-center h-full bg-transparent text-gray-500 w-4 px-2 cursor-pointer' />
        </div>
    );
}