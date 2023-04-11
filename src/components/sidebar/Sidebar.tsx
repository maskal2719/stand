import React, {useEffect, useState} from "react";
import logo from '../../../../stend/src/Assets/logo.svg'
import style from '../sidebar/Sidebar.module.css'
import moment from "moment";
import 'moment/locale/ru';
import axios from "axios";

export type GasCounterType = {
    count: string
    id: number
    to_date: Date
}
const Sidebar = () => {

    // let time = moment().format('H:mm:ss')
    let date = moment().format('dddd Do MMMM YYYY')
    const [time, setTime] = useState(moment().format('H:mm:ss'))
    const [gasCounter, setGasCounter] = useState<GasCounterType | null>(null)
    const [gas, setGas] = useState(0)
    const [dateStart, setDateStart] = useState(new Date())


    useEffect(() => {
        axios.get<GasCounterType>('http://192.168.0.211:81/api/stand/gas')
            .then((resp) => {
                setGasCounter(resp.data)
                setDateStart(resp.data.to_date)
            })
        setInterval(() => setTime(moment().format('H:mm:ss')), 1000)
    }, [])
    useEffect(() => {
        const startDate = new Date('2023-01-01');
        const now = new Date()
        const endDate = new Date(dateStart);

        const totalSeconds = ((endDate.getTime() - startDate.getTime()) - (endDate.getTime() - startDate.getTime()) % 100) / 1000;
        const totalSecToday = ((now.getTime() - startDate.getTime()) - (now.getTime() - startDate.getTime()) % 1000) / 1000
        let unitsPerSecond = Number(gasCounter?.count) / totalSeconds
        let gasSoldToday = unitsPerSecond * totalSecToday;
        let gasIn = ((Number(gasCounter?.count) - gasSoldToday) / 30 / 24 / 3600)


        let i = Math.round(unitsPerSecond * Number(gasIn)) + gasSoldToday

        setTimeout(() => {
            setGas(i)
        }, 1000)

    }, [gas]);

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
            <div className={style.gasCounter}>
                <div>Реализовано газа за 2023 год</div>
                <div>{`${Math.floor(gas)}`} м<sup>3</sup></div>
            </div>
        </div>
    );
};

export default Sidebar;