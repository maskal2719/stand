import axios from "axios";

const instance = axios.create({
    baseURL: 'http://192.168.0.5:4000/api/stand/'
})

export const api = {
    getGasCounter() {
        return instance.get('gas')
    },

    getStructure() {
        return instance.get('')
    }
}