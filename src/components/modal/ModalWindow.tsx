import React from 'react';
import {Box, IconButton, Modal} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import style from './ModalWindow.module.css'

export type ModalWindowPropsType = {
    showModal: boolean
    openModal: () => void
    closeModal: () => void
    htmlFile: string
    scrLinkVideo: string
    showVideoPlayer: boolean
}

const ModalWindow: React.FC<ModalWindowPropsType> = ({
                                                         showModal,
                                                         closeModal,
                                                         scrLinkVideo,
                                                         htmlFile,
                                                         showVideoPlayer
                                                     }) => {

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

    return (
        <>
            <Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    {showVideoPlayer ? <video src={scrLinkVideo} controls autoPlay></video> :
                        <iframe src={htmlFile} title="Pdf"></iframe>}
                    <IconButton onClick={closeModal} style={{position: 'absolute', top: '0', right: '0'}}
                                color='error' size={'large'}>
                        <CloseIcon fontSize={"large"}/>
                    </IconButton>
                </Box>
            </Modal>
        </>
    );
};

export default ModalWindow;