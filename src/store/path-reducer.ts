import {api, RootType, SctructureType} from "../api/api";
import {Dispatch} from "redux";
import {setErrorAC, setErrorACType, setUpStatusAC, setUpStatusACType} from "./app-reducer";

const initialState: RootType[] = []
const errorMessage = 'Ошибка! Обратитесь к системному администратору!'

export type ActionsType =
    ReturnType<typeof setCurrentPathAC>
    | ReturnType<typeof setPathAC>
    | ReturnType<typeof goBackPathAC>
    | setUpStatusACType
    | setErrorACType


export const PathReducer = (state: RootType[] = initialState, action: ActionsType) => {
    switch (action.type) {
        case "SET-CURRENT-PATH": {
            return [{...action.structure.all, items: [...action.structure.region.items, ...action.structure.all.items]}]
        }
        case "SET-PATH": {
            return [...state, action.el]
        }
        case "GO-BACK-PATH": {
            return action.path.slice(0, action.path.length - 1)
        }
        default : {
            return state
        }
    }
}
export const setCurrentPathAC = (structure: SctructureType) => ({type: 'SET-CURRENT-PATH', structure} as const)
export const setPathAC = (el: RootType) => ({type: 'SET-PATH', el} as const)
export const goBackPathAC = (path: Array<RootType>) => ({type: 'GO-BACK-PATH', path} as const)

export const fetchCurrentPathTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setUpStatusAC('succeeded'))
        api.getStructure()
            .then((res) => {
                dispatch(setCurrentPathAC(res.data))
                dispatch(setUpStatusAC('succeeded'))
                dispatch(setErrorAC(null))
            })
            .catch((err) => {
                dispatch(setUpStatusAC('failed'))
                dispatch(setErrorAC(errorMessage))
            })
    }
}
