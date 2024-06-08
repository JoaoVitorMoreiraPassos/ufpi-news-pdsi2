import React from 'react';
import SideBar from '@/app/components/SideBar';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import NoticeContent from '@/app/components/NoticeContent';
import { useRouter } from 'next/router';
import { Inria_Serif } from 'next/font/google';
import '@/app/globals.css';
import { OpenRegister } from '@/app/components/OpenRegister';

const inria_serif = Inria_Serif({ subsets: ['latin'], weight: ["300"] })

export default function Notice() {

    const router = useRouter();
    const { slug } = router.query;
    const [sideBarControl, setSideBarControl] = React.useState(false);


    React.useEffect(() => {
        // Modifique o metadata após a renderização inicial
        document.title = "";
    }, []);


    return (
        <div className={"my-container " + inria_serif.className}>
            <div className="relative w-full">
                <SideBar controller={sideBarControl} setController={setSideBarControl} />
                <Header SideBarController={sideBarControl} setSideBarController={setSideBarControl} />

                <main className='flex min-h-screen max-sm:px-0'>
                    <NoticeContent slug={slug as string} />
                </main>
            </div >
            <Footer />
            <OpenRegister />
        </div>
    );
};

