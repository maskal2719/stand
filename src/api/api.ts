import axios from "axios";

const instance = axios.create({
    baseURL: 'http://192.168.0.5:100/stand/api/stand/'
})

export type SctructureType = {
    all: RootType
    region: RootType
}
export type RootType = {
    deleteable: boolean
    editable: boolean
    id: number
    isDirectory: boolean
    isVideo: boolean
    items: Array<RootType>
    ldap: string
    name: string
    updated_at: string
    document: Document
}
export type Document = {
    format: string
    text: string
    type: string
    uuid: string
}
export type GasCounterType = {
    count: string
    id: number
    to_date: string
}

export const api = {
    getGasCounter() {
        return instance.get<GasCounterType>('gas')
    },

    getStructure() {
        return instance.get<SctructureType>('')
    }
}
