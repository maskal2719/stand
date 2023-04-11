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
    const begin = new Date("2023-01-01")
    const end = new Date("2023-04-30")

    const [time, setTime] = useState(moment().format('H:mm:ss'))
    const [gasCounter, setGasCounter] = useState<GasCounterType | null>(null)
    const [gas, setGas] = useState(0)
    const [dateStart, setDateStart] = useState(new Date())

    let now = new Date()


    useEffect(() => {
        axios.get<GasCounterType>('http://192.168.0.211:81/api/stand/gas')
            .then((resp) => {
                setGasCounter(resp.data)
                setDateStart(resp.data.to_date)
            })
        setInterval(() => setTime(moment().format('H:mm:ss')), 1000)
    }, [])
    let dateTest2 = new Date(dateStart)
    // const totalSeconds = (end.getTime() - begin.getTime()) / 100
    // let intervalTest = ((now.getTime() - dateTest2.getTime()) - (now.getTime() - dateTest2.getTime()) % 1000) / 1000
    // let gasSold = (Number(gasCounter?.count)) - ((Number(gasCounter?.count)) / (dateTest2.getMonth() + 1))
    // let gasPerSeconds = (((Number(gasCounter?.count))) / 30 / 24 / 3600).toFixed(2)


    // useEffect(() => {
    //     setTimeout(() => {
    //         setGas(res)
    //     }, 980)
    // },[gas])

    const [currentNumber, setCurrentNumber] = useState(0);

    useEffect(() => {
        const startDate = new Date('2023-01-01');
        const now = new Date('2023-04-11')
        const endDate = new Date('2023-04-30');

        const totalSeconds = (endDate.getTime() - startDate.getTime()) / 1000;
        const totalSecToday = (now.getTime() - startDate.getTime()) / 1000
        let unitsPerSecond = Number(gasCounter?.count) / totalSeconds
        let gasSold = unitsPerSecond * totalSecToday;
        let gasIn = ((Number(gasCounter?.count) - gasSold) / 30 / 24 / 3600)
        console.log(gasIn)
        console.log(gasSold)
        console.log(gasSold)

        let i = Math.round(unitsPerSecond * Number(gasIn)) + gasSold

        setTimeout(() => {
            setCurrentNumber(i)
        }, 980)

    }, []);

    console.log(currentNumber)


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
                <div>{`${Math.floor(currentNumber)}`}</div>
            </div>
        </div>
    );
};

export default Sidebar;