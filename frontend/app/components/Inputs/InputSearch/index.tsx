'use client';
import React from 'react';
import { faEye, faEyeSlash, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../style.css';


export default function InputSearch() {

    const [value, setValue] = React.useState('');

    return (
        <div className=" flex flex-row w-full bg-white h-10 Input rounded-lg max-sm:w-1/2"
            style={{
                boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                minWidth: '200px',
            }}>
            <input type={'text'} value={value} onChange={(e) => setValue(e.target.value)}
                className='bg-transparent w-11/12 h-full text-sm outline-none px-2 text-black' placeholder='Pesquisar...'
                style={{
                    fontWeight: '300'
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') { }
                }} />
            <FontAwesomeIcon icon={faSearch} onClick={() => { }}
                className='flex items-center justify-center h-full bg-transparent text-blue-500 w-4 px-2 cursor-pointer' />
        </div>
    );
}