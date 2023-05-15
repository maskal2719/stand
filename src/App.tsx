import React, {useEffect, useState} from 'react';
import './App.css';
// @ts-ignore
import video from './Assets/video.mp4';
import Sidebar from "./components/sidebar/Sidebar";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {RootType} from "./api/api";
import ModalWindow from "./components/modal/ModalWindow";
import Block from "./components/block/Block";
import {useAppDispatch, useAppSelector} from "./store/store";
import {fetchCurrentFolderTC, goBackToFolderAC, goToFolderAC} from "./store/folders-reducer";
import {fetchCurrentPathTC, goBackPathAC, setPathAC} from "./store/path-reducer";
import {useIdleTimer} from "react-idle-timer";
import {ErrorType, RequestStatusType} from "./store/app-reducer";
import imgHand from './Assets/click.png'

function App() {

    //Получаем стейт из стора
    const folders = useAppSelector<RootType[]>(state => state.folders)
    const path = useAppSelector<RootType[]>(state => state.path)
    const status = useAppSelector<RequestStatusType>((state) => state.app.status)
    const error = useAppSelector<ErrorType>((state) => state.app.error)
    const dispatch = useAppDispatch()

    const btnStyle = {
        position: 'absolute',
        left: '90px',
        top: '520px',
        backgroundColor: 'aliceblue',
        width: '100px',
        height: '100px'
    }//Стили для кнопки назад

    const [uuidDoc, setUuidDoc] = useState<string>('')//id документа для открытия
    const [videoSrc, setVideoSrc] = useState<string>('')// src путь для открытия видео

    const [showVideoPlayer, setShowVideoPlayer] = useState<boolean>(false)//Стейт для модалки(видео)
    const [showModal, setShowModal] = useState(false)//Стейт для модалки(пдф)
    //Получения линок для открытия видео и пдф
    const currentUrl = window.location.href
    let htmlFile = `${currentUrl}pdfReaderFlipbook/index.html?id=${uuidDoc}`
    let scrLinkVideo = `http://192.168.0.5:4000/static/video/${videoSrc}`
    //Получения линок для открытия видео и пдф

    //Для отслеживания бездействия поьзователя ---------------------------------------
    const [event, setEvent] = useState<string>('Event')
    const [elapsed, setElapsed] = useState<number>(0)//время бездействия пользователя
    const timeToHide = elapsed > 180 // время бездействия, после которого сбрасыется путь, идет повторный запрос на сервер

    const onAction = (event?: Event) => {
        setEvent(event?.type ?? 'Event')
        reset()
        if (event && timeToHide) {
            const thunkFolder = fetchCurrentFolderTC()
            const thunkPath = fetchCurrentPathTC()
            dispatch(thunkFolder)
            dispatch(thunkPath)
        }
    }

    const {getElapsedTime, reset} = useIdleTimer({
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

    useEffect(() => {
        const thunkFolder = fetchCurrentFolderTC()
        const thunkPath = fetchCurrentPathTC()
        dispatch(thunkFolder)
        dispatch(thunkPath)
    }, [dispatch]);

    useEffect(() => {
        if (timeToHide) {
            closeModal()
        }
    }, [timeToHide])

    const closeModal = () => {
        setShowModal(false)
        setShowVideoPlayer(false)
    }
    const openModal = () => setShowModal(true);
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
                {
                    error === null
                        ?
                        <div className={timeToHide ? 'content inactive' : 'content'}>
                            {
                                status === "loading" && <CircularProgress/>
                            }
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
                        :
                        <div className={'errorActive'}>
                            {error}
                        </div>
                }
                <ModalWindow closeModal={closeModal} openModal={openModal} scrLinkVideo={scrLinkVideo}
                             htmlFile={htmlFile} showVideoPlayer={showVideoPlayer} showModal={showModal}/>
            </>
            <div className={timeToHide ? 'activeHandClick' : 'inactiveHandClick'}>
                <img src={imgHand} alt=""/>
            </div>
        </div>
    );
}

export default React.memo(App);
