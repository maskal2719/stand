import React, {useEffect, useState} from 'react';
import './App.css';
// @ts-ignore
import video from './Assets/video.mp4';
import Sidebar from "./components/sidebar/Sidebar";
import {Box, Button, CircularProgress, IconButton, Modal} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CloseIcon from '@mui/icons-material/Close';
import {useIdleTimer} from "react-idle-timer";
import {api} from "./api/api";


export type MainType = {
    deleteable: boolean
    editable: boolean
    id: number
    isDirectory: boolean
    items: MainType[]
    document: Document | null
    ldap: string
    name: string
    updated_at: string
    isVideo: boolean
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

    const [appStructureState, setStructureState] = useState<AppStructureStateType | null>(null)
    const [currentFolder, setCurrentFolder] = useState<MainType[]>([])
    const [currentPath, setCurrentPath] = useState<MainType[]>([])
    const [defaultPath, setDefaultPath] = useState<MainType[]>([])// хз зачем че и куда
    const [uuidDoc, setUuidDoc] = useState('')
    const [videoSrc, setVideoSrc] = useState('')
    const [error, setError] = useState(null) // сделать обработку ошибок при запросе
    const [status, setStatus] = useState(false) // сделать крутилку при загрузке данных
    const [showVideoPlayer, setShowVideoPlayer] = useState(false)
    //
    //Для отслеживания бездействия поьзователя ---------------------------------------
    // const [event, setEvent] = useState<string>('Event')
    // const [elapsed, setElapsed] = useState<number>(0)
    //
    // const onAction = (event?: Event) => {
    //     setEvent(event?.type ?? 'Event')
    //
    //     reset()
    // }
    //
    // const { getElapsedTime, reset } = useIdleTimer({
    //     onAction,
    //     timeout: 10_000,
    //     throttle: 500
    // })
    //
    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setElapsed(Math.ceil(getElapsedTime() / 1000))
    //     }, 1000)
    //
    //     return () => {
    //         clearInterval(interval)
    //     }
    // })
    //
    // console.log(elapsed)
    //Для отслеживания бездействия поьзователя ---------------------------------------
    const [showModal, setShowModal] = useState(false);

    let htmlFile = `http://localhost:3000/pdfReaderFlipbook/index.html?id=${uuidDoc}`
    let scrLinkVideo = `http://192.168.0.211/static/video/${videoSrc}`


    const closeModal = () => {
        setShowModal(false)
        setShowVideoPlayer(false)
    }
    const openModal = () => setShowModal(true);

    const modalStyle = {
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
        textAlign: 'center'
    };
    const btnStyle = {
        position: 'absolute',
        left: '90px',
        top: '520px',
        backgroundColor: 'aliceblue',
        width: '100px',
        height: '100px'
    }

    useEffect(() => {
        setStatus(true)
        api.getStructure()
            .then((resp) => {
                setStructureState(resp.data);
                setCurrentFolder([...resp.data.region.items, ...resp.data.all.items])
                setCurrentPath([{...resp.data.all, items: [...resp.data.region.items, ...resp.data.all.items]}])
                setDefaultPath([{...resp.data.all, items: [...resp.data.region.items, ...resp.data.all.items]}])
            })
            .catch((err) => {
                console.log(new Error(err))
            })
            .finally(() => {
                setStatus(false)
            })
        ;
    }, []);


    const goTo = (el: any) => {
        if (el.isDirectory) {
            setCurrentFolder(el.items)
            setCurrentPath([...currentPath, el])
        } else if (el.document) {
            setUuidDoc(el.document.uuid)
            openModal()
        } else if (el.isVideo) {
            setVideoSrc(el.name)
            setShowVideoPlayer(true)
            openModal()
        }
    }
    const goBack = () => {
        if (currentPath.length > 1) {
            setCurrentFolder([...currentPath[currentPath.length - 2].items])
            setCurrentPath(currentPath.slice(0, currentPath.length - 1))
        }
    }

    return (
        <div className={'container'}>
            <Sidebar/>
            <div className="video-container">
                <video autoPlay muted loop src={video}></video>
            </div>
            <div className='content'>
                {currentPath.length > 1 &&
                    <IconButton sx={btnStyle} onClick={goBack}>
                        <ArrowBackIosIcon/>
                    </IconButton>
                }
                {status && <CircularProgress/>}
                {currentFolder?.map((el) =>
                    <div onClick={() => goTo(el)}
                         className='block'
                         key={el.id}>{el.name.replace(/\.[^.]+$/, "").slice(0, 90)}
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
                        <Box sx={modalStyle}>
                            {showVideoPlayer ? <video src={scrLinkVideo} controls></video> :
                                <iframe src={htmlFile} title="Pdf"></iframe>}
                            <IconButton onClick={closeModal} style={{position: 'absolute', top: '0', right: '0'}}
                                        color='error' size={'large'}>
                                <CloseIcon fontSize={"large"}/>
                            </IconButton>
                        </Box>
                    </Modal>
                </>
            }
        </div>
    );
}

export default App;
