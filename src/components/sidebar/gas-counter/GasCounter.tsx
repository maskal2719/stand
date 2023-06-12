import React, {useEffect, useState} from 'react';
import style from "../Sidebar.module.css";


import {api, GasCounterType} from "../../../api/api";
import {CircularProgress} from "@mui/material";

const GasCounter = () => {

    const [gasCounter, setGasCounter] = useState<GasCounterType | null>(null)
    const [gas, setGas] = useState(0)
    const [dateStart, setDateStart] = useState('')


    useEffect(() => {
        api.getGasCounter()
            .then((resp) => {
                setGasCounter(resp.data)
                setDateStart(resp.data.to_date)
            })
            .catch((err) => {
                console.log(new Error(err))
            })
    }, [])

    useEffect(() => {
        const now = new Date()
        const startDate = new Date(dateStart);

        let interval = ((now.getTime() - startDate.getTime()) - (now.getTime() - startDate.getTime()) % 1000) / 1000;

        let gasInSeconds = ((Number(gasCounter?.count_plan) - Number(gasCounter?.count)) / 30 / 24 / 3600).toFixed(2)
        let currentGasValue = Math.round(interval * Number(gasInSeconds)) + (Number(gasCounter?.count))

        currentGasValue = Math.round(Number(parseFloat(String(currentGasValue)))) + Number(parseInt(gasInSeconds))
        const timeOut = setTimeout(() => {
            setGas(currentGasValue)
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
