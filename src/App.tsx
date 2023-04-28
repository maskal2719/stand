import React, {useEffect, useState} from 'react';
import './App.css';
// @ts-ignore
import video from './Assets/video.mp4';
import Sidebar from "./components/sidebar/Sidebar";
import {CircularProgress, IconButton} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {api} from "./api/api";
import ModalWindow from "./components/modal/ModalWindow";
import Block from "./components/block/Block";


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
    const [defaultFolder, setDefaultFolder] = useState<MainType[]>([])
    const [currentPath, setCurrentPath] = useState<MainType[]>([])
    const [defaultPath, setDefaultPath] = useState<MainType[]>([])// хз зачем че и куда
    const [uuidDoc, setUuidDoc] = useState<string>('')
    const [videoSrc, setVideoSrc] = useState<string>('')
    const [error, setError] = useState(null) // сделать обработку ошибок при запросе
    const [status, setStatus] = useState<boolean>(false) // сделать крутилку при загрузке данных
    const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false)
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
    const [inactiveTime, setInactiveTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const currentUrl = window.location.href

    let htmlFile = `${currentUrl}pdfReaderFlipbook/index.html?id=${uuidDoc}`
    let scrLinkVideo = `http://192.168.0.5:4000/static/video/${videoSrc}`
    const timeToHide = inactiveTime > 180


    const closeModal = () => {
        setShowModal(false)
        setShowVideoPlayer(false)
    }
    const openModal = () => setShowModal(true);


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
                setDefaultFolder([...resp.data.region.items, ...resp.data.all.items])
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
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setInactiveTime(inactiveTime + 1);
        }, 1000);
        window.addEventListener('mousemove', () => setInactiveTime(0))
        window.addEventListener('click', () => setInactiveTime(0))

        if (timeToHide) {
            setCurrentPath([...defaultPath])
            setCurrentFolder([...defaultFolder])
            closeModal()
        }
        return () => clearTimeout(timeoutId);
    }, [inactiveTime])


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
            <>
                <Sidebar timeToHide={timeToHide}/>
                <div className="video-container">
                    <video autoPlay muted loop src={video}></video>
                </div>
                <div className={timeToHide ? 'content inactive' : 'content'}>
                    {currentPath.length > 1 &&
                        <IconButton sx={btnStyle} className={'iconBtn'} onClick={goBack}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                    }
                    {status && <CircularProgress/>}
                    {
                        currentFolder?.map((el) =>
                            <Block key={el.id} block={el} goTo={goTo} />
                        )
                    }
                </div>

                <ModalWindow closeModal={closeModal} openModal={openModal} scrLinkVideo={scrLinkVideo}
                             htmlFile={htmlFile} showVideoPlayer={showVideoPlayer} showModal={showModal}/>
            </>
        </div>
    );
}

export default App;
