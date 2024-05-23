'use client';
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './style.css'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const Carousel = ({ children }: { children: React.ReactNode }) => {

    const [scrollPostion, setScrollPosition] = React.useState(0);
    const [leftButton, setLeftButton] = React.useState(false);
    const [rightButton, setRightButton] = React.useState(false);
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.target as HTMLDivElement;
        setScrollPosition(element.scrollLeft);
    }


    React.useEffect(() => {
        const element = document.querySelector('.carousel') as HTMLDivElement;
        const width = element.scrollWidth;
        // Block or unblock the left button
        if (scrollPostion === 0) {
            setLeftButton(false);
        } else {
            setLeftButton(true);
        }

        // Block or unblock the right button
        if (scrollPostion + element.clientWidth >= width - 10) {
            setRightButton(false);
        } else {
            setRightButton(true);
        }
    }, [scrollPostion])

    const handleLeft = () => {
        if (!leftButton) {
            return;
        }
        const element = document.querySelector('.carousel') as HTMLDivElement;
        const card = document.querySelector('.card') as HTMLDivElement;
        const newPosition = scrollPostion - card.clientWidth;
        element.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });
        setScrollPosition(newPosition);
    }

    const handleRight = () => {
        if (!rightButton) {
            return;
        }
        const element = document.querySelector('.carousel') as HTMLDivElement;
        const card = document.querySelector('.card') as HTMLDivElement;
        const newPosition = scrollPostion + card.clientWidth;
        element.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });
        setScrollPosition(newPosition);
    }

    return (
        <div className='flex flex-col gap-0 pt-8'>

            <div className='w-full flex justify-end gap-1 max-md:hidden'>
                <button className={' transition-all duration-200 w-10 h-10 flex flex-row justify-center items-center gap-2  rounded-full border-2 ' +
                    (leftButton ? ' text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer' : ' text-gray-300 border-gray-300 cursor-not-allowed')
                } disabled={!leftButton}>
                    <FontAwesomeIcon icon={faChevronLeft}
                        className='w-5 h-5'
                        onClick={handleLeft}
                    />
                </button>
                <button className={'transition-all duration-200 w-10 h-10 flex flex-row justify-center items-center gap-2  rounded-full border-2' +
                    (rightButton ? ' text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer' : ' text-gray-300 border-gray-300 cursor-not-allowed')
                } disabled={!rightButton}>
                    <FontAwesomeIcon icon={faChevronRight} className='w-5 h-5'
                        onClick={handleRight}
                    />
                </button>
            </div>
            <div className="carousel flex flex-row items-start overflow-x-auto gap-4 w-full max-sm:px-4 pt-2 pb-8 h-auto"
                onScroll={handleScroll}
            >
                {children}
            </div>

        </div>
    )
}

export default Carousel