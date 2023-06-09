import React, {useEffect, useState} from 'react';
import style from "../Sidebar.module.css";


import {api, GasCounterType} from "../../../api/api";
import {CircularProgress} from "@mui/material";

const GasCounter = () => {

    const [gasCounter, setGasCounter] = useState<GasCounterType | null>(null)
    const [gasCounterPlan, setGasCounterPlan] = useState<string | null>(null)
    const [gas, setGas] = useState(0)
    const [dateStart, setDateStart] = useState('')


    useEffect(() => {
        api.getGasCounter()
            .then((resp) => {
                setGasCounter(resp.data)
                setGasCounterPlan(resp.data.count_plan)
                setDateStart(resp.data.to_date)
            })
            .catch((err) => {
                console.log(new Error(err))
            })
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

        const timeOut = setTimeout(() => {
            setGas(i)
        }, 1000)

        return () => {
            clearTimeout(timeOut)
        }

    }, [dateStart, gas, gasCounter?.count]);
    return (
        <div className={style.gasCounter}>
            <div>Реализовано газа за 2023 год</div>
            {
                !gas ? <CircularProgress/> : <div>{`${Math.floor(gas)}`.replace(/(\d)(?=(\d{3})+(\D|$))/g, '$1 ')} м<sup>3</sup></div>
            }
        </div>
    );
};

export default React.memo(GasCounter);
