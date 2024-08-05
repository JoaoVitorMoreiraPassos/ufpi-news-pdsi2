import { faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import './style.css'

export const InputFile = ({ accept, changeEvent }: { accept: string, changeEvent: (event: React.ChangeEvent<HTMLInputElement>) => void }) => {
    return (
        <div className="app">
            <div className="parent">
                <div className="file-upload">
                    <FontAwesomeIcon icon={faCloudArrowUp} size="3x" />
                    <h3>Click box to upload</h3>
                    <p>Maximun file size 10mb</p>
                    <input type="file" accept={accept} onChange={changeEvent} />
                </div>
            </div>
        </div>
    )
}
