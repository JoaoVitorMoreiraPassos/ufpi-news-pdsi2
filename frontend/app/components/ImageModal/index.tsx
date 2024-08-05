'use client';
import { useRef, useState } from 'react';
import { faCheck, faCloudArrowUp, faScissors } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { set } from 'date-fns';
import React, { Children } from 'react';
import { useDropzone } from 'react-dropzone';
import { CircularProgress } from '@mui/material';
import ReactCrop, {
    centerCrop,
    convertToPixelCrop,
    makeAspectCrop,
} from "react-image-crop";
import 'react-image-crop/dist/ReactCrop.css';
import setCanvasPreview from "./setCanvasPreview";


const ASPECT_RATIO = 1;
const MIN_DIMENSION = 300;

export const BeautifulImageDropzone = (
    { children, image, setImage, imageFile, setFile, close }:
        {
            children: React.ReactNode,
            image: String | null,
            imageFile?: File | null,
            setImage: React.Dispatch<React.SetStateAction<string | null>>,
            setFile?: React.Dispatch<React.SetStateAction<File | null>>,
            close: React.Dispatch<React.SetStateAction<boolean>>
        }
) => {
    const imgRef = useRef<HTMLImageElement | null>(null);
    const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const [imgSrc, setImgSrc] = useState("");
    const [crop, setCrop] = useState<any>();
    const [error, setError] = useState("");
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': ['.jpg', '.jpeg', '.png'] },
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (!file) return;

            const reader = new FileReader();

            reader.addEventListener("load", () => {
                const imageElement = new Image();
                const imageUrl = reader.result?.toString() || "";
                imageElement.src = imageUrl;

                imageElement.addEventListener("load", (e) => {
                    if (error) setError("");
                    const tartet = e.currentTarget;
                    const { naturalWidth, naturalHeight } = tartet as HTMLImageElement;
                    if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
                        setError("Image must be at least 150 x 150 pixels.");
                        return setImgSrc("");
                    }
                });
                setImgSrc(imageUrl);
            });
            reader.readAsDataURL(file);
        },
    });


    const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        const { width, height } = e.currentTarget;
        const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

        const crop = makeAspectCrop(
            {
                unit: "%",
                width: cropWidthInPercent,
            },
            ASPECT_RATIO,
            width,
            height
        );
        const centeredCrop = centerCrop(crop, width, height);
        setCrop(centeredCrop as any);
    };


    return (

        <div className='fixed z-50 w-full h-full flex flex-col items-center justify-center'>
            <div className='relative bg-white max-w-screen-lg md:w-5/6 md:h-4/5 max-md:w-full max-md:h-full  p-8 pt-4 rounded-3xl flex flex-col items-center justify-center gap-4'>

                {children}
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} `}>
                    <div className='w-96 rounded-3xl bg-white flex flex-col gap-2 items-center justify-center cursor-pointer'>
                        <input {...getInputProps()} className=' outline-none' />
                        {
                            isDragActive ?

                                (
                                    <div className='w-full flex gap-6 flex-col items-center justify-end bg-gray-200 rounded-3xl p-4 '>
                                        <FontAwesomeIcon icon={faCloudArrowUp} size="6x" className='text-blue-400' />
                                        <p className='text-center'>Solte as imagens aqui ...</p>
                                    </div>
                                ) :
                                (
                                    <div className='w-full flex gap-6 flex-col items-center justify-end bg-gray-200 rounded-3xl p-4 '>
                                        <FontAwesomeIcon icon={faCloudArrowUp} size="6x" className='text-gray-400' />
                                        <p className='text-center'>Arraste e solte algumas imagens aqui, ou clique para selecionar imagens</p>
                                    </div>
                                )
                        }

                    </div>
                </div>
                {error && <p className="text-red-400 text-xs">{error}</p>}
                {imgSrc && (
                    <div className="bg-white flex flex-col items-center justify-center z-50 fixed max-w-screen-lg md:w-5/6 md:h-full max-md:w-full max-md:h-full">
                        <ReactCrop
                            crop={crop}
                            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
                            circularCrop
                            keepSelection
                            aspect={ASPECT_RATIO}
                            minWidth={MIN_DIMENSION}
                        >
                            <img
                                ref={imgRef}
                                src={imgSrc}
                                alt="Upload"
                                style={{ maxHeight: "70vh" }}
                                onLoad={onImageLoad}
                            />
                        </ReactCrop>
                        <button
                            className="text-white font-mono text-xs py-2 px-4 rounded-2xl mt-4 bg-sky-500 hover:bg-sky-600"
                            onClick={() => {
                                if (imgRef.current && previewCanvasRef.current) { // Ensure both refs are not null
                                    setCanvasPreview(
                                        imgRef.current,  //HTMLImageElement
                                        previewCanvasRef.current, // HTMLCanvasElement
                                        convertToPixelCrop(
                                            crop,
                                            imgRef.current.width,
                                            imgRef.current.height
                                        )
                                    );
                                    const dataUrl = previewCanvasRef.current.toDataURL();


                                    setImage(dataUrl);

                                    if (previewCanvasRef.current) {
                                        previewCanvasRef.current.toBlob((blob) => {
                                            if (blob) {
                                                const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                                                if (file) {
                                                    setFile(file);
                                                }
                                            }
                                        }, 'image/jpeg');
                                    }

                                    close(false);
                                }
                            }}
                        >
                            Cortar
                        </button>
                    </div>
                )}
                {crop && (
                    <canvas
                        ref={previewCanvasRef}
                        className="mt-4 z-50"
                        style={{
                            display: "none",
                            border: "1px solid black",
                            objectFit: "contain",
                            width: 150,
                            height: 150,
                        }}
                    />
                )}
            </div>
        </div>

        // <div className='fixed z-50 w-full h-full flex flex-col items-center justify-center'>
        //     <div className='relative bg-white max-w-screen-lg md:w-5/6 md:h-4/5 max-md:w-full max-md:h-full p-8 pt-4 rounded-3xl flex flex-col items-center justify-center gap-4'>
        //         {children}
        //         {
        //             imgSrc && (
        //                 <div className='fixed flex flex-col gap-4 items-center justify-center z='>
        //                     <div className='max-md:w-screen max-md:h-screen'>
        //                         <div className='md:w-96 md:h-72 max-md:w-screen max-md:fixed max-md:h-screen opacity-100'>
        //                             <ReactCrop
        //                                 crop={crop}
        //                                 onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
        //                                 circularCrop
        //                                 keepSelection
        //                                 aspect={ASPECT_RATIO}
        //                                 minWidth={MIN_DIMENSION}
        //                             />
        //                         </div>
        //                     </div>
        //                     <div className='absolute bottom-10 flex z-50 gap-2'>

        //                         <button onClick={() => {
        //                             setCanvasPreview(
        //                                 imgRef.current, // HTMLImageElement
        //                                 previewCanvasRef.current, // HTMLCanvasElement
        //                                 convertToPixelCrop(
        //                                     crop,
        //                                     imgRef?.current.width,
        //                                     imgRef?.current.height
        //                                 )
        //                             );
        //                             const dataUrl = previewCanvasRef.current.toDataURL();
        //                             updateAvatar(dataUrl);
        //                             closeModal();
        //                         }} className='bg-green-500 rounded-md px-4 py-2 text-white font-semibold hover:bg-green-400 transition duration-300 ease-in-out'>
        //                             Cortar
        //                         </button>

        //                     </div>
        //                 </div>
        //             )
        //         }
        //         <div>
        //             {error && <p className='text-red-500'>{error}</p>}
        //             {

        //                 imgSrc &&

        //                 <div className='flex items-center justify-center flex-col gap-2'>
        //                     <img ref={imgRef}
        //                         src={imgSrc}
        //                         alt="Upload"
        //                         // style={{ maxHeight: "70vh" }}
        //                         onLoad={onImageLoad} className='w-28 h-28 rounded-full'
        //                         style={
        //                             {
        //                                 boxShadow: '10px 10px 10px 0 rgba(0, 0, 0, 0.25)'
        //                             }
        //                         } />
        //                     {/* <div className='flex gap-2'>
        //                         <button onClick={
        //                             () => setShowCropper(true)
        //                         }
        //                             className='bg-blue-300 rounded-md px-4 py-2 text-white font-semibold hover:bg-blue-400 transition duration-300 ease-in-out'
        //                         >
        //                             <FontAwesomeIcon icon={faScissors} className='text-white' />
        //                         </button>
        //                         <button onClick={
        //                             () => {
        //                                 setImage(vitrineImage);
        //                                 close(false);
        //                             }
        //                         }
        //                             className='bg-green-300 rounded-md px-4 py-2 text-white font-semibold hover:bg-green-400 transition duration-300 ease-in-out'
        //                         >
        //                             <FontAwesomeIcon icon={faCheck} className='text-white' />
        //                         </button>
        //                     </div> */}

        //                 </div>
        //             }
        //         </div>
        //         {crop && (
        //             <canvas
        //                 ref={previewCanvasRef}
        //                 className="mt-4"
        //                 style={{
        //                     display: "none",
        //                     border: "1px solid black",
        //                     objectFit: "contain",
        //                     width: 150,
        //                     height: 150,
        //                 }}
        //             />
        //         )}
        //         <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} `}>
        //             <div className='w-96 rounded-3xl bg-white flex flex-col gap-2 items-center justify-center cursor-pointer'>
        //                 <input {...getInputProps()} className=' outline-none' />
        //                 {
        //                     isDragActive ?

        //                         (
        //                             <div className='w-full flex gap-6 flex-col items-center justify-end bg-gray-200 rounded-3xl p-4 '>
        //                                 <FontAwesomeIcon icon={faCloudArrowUp} size="6x" className='text-blue-400' />
        //                                 <p className='text-center'>Solte as imagens aqui ...</p>
        //                             </div>
        //                         ) :
        //                         (
        //                             <div className='w-full flex gap-6 flex-col items-center justify-end bg-gray-200 rounded-3xl p-4 '>
        //                                 <FontAwesomeIcon icon={faCloudArrowUp} size="6x" className='text-gray-400' />
        //                                 <p className='text-center'>Arraste e solte algumas imagens aqui, ou clique para selecionar imagens</p>
        //                             </div>
        //                         )
        //                 }

        //             </div>
        //         </div>
        //     </div>
        // </div>
    );
};