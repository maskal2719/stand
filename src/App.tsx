import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
// @ts-ignore
import video from './Assets/video.mp4';
import Sidebar from "./components/sidebar/Sidebar";
import {Box, Modal, Typography} from "@mui/material";
import {useIdleTimer} from "react-idle-timer";

export type MainType = {
    deleteable: boolean
    editable: boolean
    id: number
    isDirectory: boolean
    items: MainType[] | File[]
    ldap: string
    name: string
    updated_at: string
}
export type Document = {
    format: string
    text: string
    type: string
    uuid: string
}
export type File = {
    deleteable: boolean
    editable: boolean
    id: number
    isDirectory: boolean
    items: MainType[] | File[]
    ldap: string
    name: string
    updated_at: string
    document: Document
}
export type AppStructureStateType = {
    all: MainType
    region: MainType
}

function App() {

    const [appStructureState, setStructureState] = useState<AppStructureStateType | null>(null);
    const [currentFolder, setCurrentFolder] = useState<MainType[]>([]);
    const [currentPath, setCurrentPath] = useState<MainType[]>([]);
    const [uuidDoc, setUuidDoc] = useState('')

    const [showModal, setShowModal] = useState(false);
    let htmlFile = `http://localhost:3000/pdfReaderFlipbook/index.html?id=${uuidDoc}`


    const closeModal = () => setShowModal(false);
    const openModal = () => setShowModal(true);

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '90%',
        bgcolor: 'rgba(31, 112, 127, 0.3)',
        backdropFilter: 'blur(3px)',
        boxShadow: 24,
        border: 'none',
        p: 4,
    };

    useEffect(() => {
        axios
            .get<AppStructureStateType>('http://192.168.0.211:80/api/stand')
            .then((resp) => {
                setStructureState(resp.data);
                setCurrentFolder(resp.data.all.items)
                setCurrentPath([resp.data.all])
            });
    }, []);

    const goTo = (el: any) => {
        if (el.isDirectory) {
            setCurrentFolder(el.items)
            setCurrentPath([...currentPath, el])
        } else if (!el.isDirectory) {
            setUuidDoc(el.document.uuid)
            openModal()
        }
    }
    const goBack = () => {
        if(currentPath.length > 1) {
            setCurrentPath(currentPath)
            setCurrentFolder(currentPath[currentPath.length-1].items)
        }
    }

    console.log(currentPath)
    console.log(currentFolder)

    return (
        <div className={'container'}>
            <Sidebar/>
            <div className="video-container">
                <video autoPlay muted loop src={video}></video>
            </div>
            <div className='content'>
                <button onClick={goBack}>Back</button>
                {currentFolder?.map((el) =>
                    <div onClick={() => goTo(el)}
                         className='block'
                         key={el.id}>{el.name}
                    </div>)}
            </div>
            {
                <>
                    <Modal
                        open={showModal}
                        onClose={closeModal}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <iframe src={htmlFile} title="Pdf"></iframe>
                        </Box>
                    </Modal>

                </>
            }
        </div>
    );
}

export default App;
