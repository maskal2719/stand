import React, {useEffect, useState} from "react";
import logo from '../../../../stend/src/Assets/logo.svg'
import style from '../sidebar/Sidebar.module.css'
import moment from "moment";
import 'moment/locale/ru';
import GasCounter from "./gas-counter/GasCounter";

export type GasCounterType = {
    count: string
    id: number
    to_date: Date
}
export type SidebarPropsType = {
    timeToHide?: boolean
}
const Sidebar:React.FC<SidebarPropsType> = ({timeToHide}) => {
    let date = moment().format('dddd Do MMMM YYYY')
    const [time, setTime] = useState(moment().format('H:mm'))

    useEffect(() => {
        setInterval(() => setTime(moment().format('H:mm')), 1000)
    },[])

    return (
        <div className={timeToHide ? `${style.sidebar} + ${style.hide}` : `${style.sidebar}`}>
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
            <GasCounter/>
        </div>
    );
};

export default React.memo(Sidebar);