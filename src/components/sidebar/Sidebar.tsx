import React from "react";
import logo from '../../../../stend/src/Assets/logo.svg'
import style from '../sidebar/Sidebar.module.css'
import moment from "moment";
import 'moment/locale/ru';

const Sidebar = () => {
    let time = moment().format('H:mm')
    let date = moment().format('dddd Do MMMM YYYY')
    return (
        <div className={style.sidebar}>
            <div className={style.time}>
                <div>
                    {time}
                </div>
                <div>
                    {date}
                </div>
            </div>
            <div className={style.containerLogo}>
                <img className={style.logo} src={logo} width="80%" alt='logo'/>
            </div>
        </div>
    );
};

export default Sidebar;