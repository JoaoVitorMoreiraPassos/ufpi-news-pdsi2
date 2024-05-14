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
        // get the width of the carousel
        const width = element.scrollWidth;
        if (scrollPostion < 10) {
            setLeftButton(false);
        }
        else {
            setLeftButton(true);
        }

        if (scrollPostion + element.clientWidth >= width - 10) {
            setRightButton(false);
        }
        else {
            setRightButton(true);
        }
        console.log(scrollPostion, width, element.clientWidth);
        console.log(leftButton, rightButton);
    }, [scrollPostion])

    const handleLeft = () => {
        if (!leftButton) {
            return;
        }
        const screnWidth = window.innerWidth;
        const element = document.querySelector('.carousel') as HTMLDivElement;
        const newPosition = scrollPostion - screnWidth;
        element.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });
    }

    const handleRight = () => {
        if (!rightButton) {
            return;
        }
        const element = document.querySelector('.carousel') as HTMLDivElement;
        const screnWidth = window.innerWidth;
        const newPosition = scrollPostion + screnWidth;
        element.scrollTo({
            left: newPosition,
            behavior: 'smooth'
        });

    }

    return (
        <div className='flex flex-col gap-0 pt-8'>
            <div className='w-full flex justify-end gap-1'>
                <button className={' w-10 h-10 flex flex-row justify-center items-center gap-2 text-blue-500 border-blue-500 rounded-full border-2 hover:bg-blue-500 hover:text-white cursor-pointer'} disabled={!leftButton}>
                    <FontAwesomeIcon icon={faChevronLeft}
                        onClick={handleLeft}
                    />
                </button>
                <button className=' w-10 h-10 flex flex-row justify-center items-center gap-2 text-blue-500 border-blue-500 rounded-full border-2 hover:bg-blue-500 hover:text-white' disabled={!rightButton}>
                    <FontAwesomeIcon icon={faChevronRight}
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