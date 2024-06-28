'use client';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

type Option = {
    value: string;
    label: string;
    checked?: boolean;
};

interface SelectProps {
    id?: string;
    value: string;
    placeholder?: string;
    options: Option[];
    onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ id, value, options, onChange, placeholder }) => {
    return (
        <div className='relative bg-white w-full h-10 rounded-lg  shadow-sm'>
            <select
                id={id ? id : undefined}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='w-full h-full rounded-lg px-2 py-0 outline-none text-gray-900 bg-transparent appearance-none cursor-pointer'
                style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none', border: "2px solid #ced4da", }}
            >
                <option value="" disabled>{placeholder}</option>
                {
                    options.map((option) => {
                        return <option key={option.value} value={option.value}>{option.label}</option>
                    })
                }
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-2 flex items-center px-2 text-gray-700'>
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
        </div >
    );
};

export default Select;