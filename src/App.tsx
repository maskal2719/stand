import React, {useEffect, useState} from 'react';
import './App.css';
// @ts-ignore
import video from './Assets/video.mp4';
import Sidebar from "./components/sidebar/Sidebar";
import {IconButton} from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {RootType} from "./api/api";
import ModalWindow from "./components/modal/ModalWindow";
import Block from "./components/block/Block";
import {useAppDispatch, useAppSelector} from "./store/store";
import {fetchCurrentFolderTC, goBackToFolderAC, goToFolderAC} from "./store/folders-reducer";
import {fetchCurrentPathTC, goBackPathAC, setPathAC} from "./store/path-reducer";
import {useIdleTimer} from "react-idle-timer";

function App() {

    const folders = useAppSelector<RootType[]>(state => state.folders)
    const path = useAppSelector<RootType[]>(state => state.path)
    const dispatch = useAppDispatch()

    const [uuidDoc, setUuidDoc] = useState<string>('')
    const [videoSrc, setVideoSrc] = useState<string>('')
    const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false)


    const [inactiveTime, setInactiveTime] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const currentUrl = window.location.href

    let htmlFile = `${currentUrl}pdfReaderFlipbook/index.html?id=${uuidDoc}`
    let scrLinkVideo = `http://192.168.0.5:4000/static/video/${videoSrc}`

    const btnStyle = {
        position: 'absolute',
        left: '90px',
        top: '520px',
        backgroundColor: 'aliceblue',
        width: '100px',
        height: '100px'
    }

    //
    //Для отслеживания бездействия поьзователя ---------------------------------------
    const [event, setEvent] = useState<string>('Event')
    const [elapsed, setElapsed] = useState<number>(0)
    const timeToHide = elapsed > 5

    const onAction = (event?: Event) => {
        setEvent(event?.type ?? 'Event')
        reset()
    }

    const { getElapsedTime, reset } = useIdleTimer({
        onAction,
        timeout: 10_000,
        throttle: 500
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setElapsed(Math.ceil(getElapsedTime() / 1000))
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    })

    //Для отслеживания бездействия поьзователя ---------------------------------------

    const closeModal = () => {
        setShowModal(false)
        setShowVideoPlayer(false)
    }
    const openModal = () => setShowModal(true);


    useEffect(() => {
        const thunkFolder = fetchCurrentFolderTC()
        const thunkPath = fetchCurrentPathTC()
        dispatch(thunkFolder)
        dispatch(thunkPath)
    }, [dispatch]);


    const goTo = (el: RootType) => {
        if (el.isDirectory) {
            dispatch(goToFolderAC(el))
            dispatch(setPathAC(el))
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
        if (path.length > 1) {
            dispatch(goBackToFolderAC(path))
            dispatch(goBackPathAC(path))
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
                    {path.length > 1 &&
                        <IconButton sx={btnStyle} className={'iconBtn'} onClick={goBack}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                    }
                    {
                        folders?.map((el) =>
                            <Block key={el.id} block={el} goTo={goTo}/>
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
