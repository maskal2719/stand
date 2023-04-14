import axios from "axios";
import {GasCounterType} from "../components/sidebar/Sidebar";
import {AppStructureStateType} from "../App";

export const BASE_API_URL = 'http://192.168.0.211:80/api/stand';

export const getGasCounter = () => {
    return axios.get<GasCounterType>(`${BASE_API_URL}/gas`)
}
export const getStructure = () => {
    return axios.get<AppStructureStateType>(BASE_API_URL)
}