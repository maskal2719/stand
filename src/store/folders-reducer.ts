import {api, RootType, SctructureType} from "../api/api";
import {Dispatch} from "redux";
import {setErrorAC, setErrorACType, setUpStatusAC, setUpStatusACType} from "./app-reducer";

const initialState: RootType[] = []

export type ActionsType =
    ReturnType<typeof setCurrentFolderAC>
    | ReturnType<typeof goToFolderAC>
    | ReturnType<typeof goBackToFolderAC>
    | setUpStatusACType
    | setErrorACType


export const FoldersReducer = (state: RootType[] = initialState, action: ActionsType) => {
    switch (action.type) {
        case "SET-CURRENT-FOLDER": {
            return [...action.structure.region.items, ...action.structure.all.items]
        }
        case "GO-TO-FOLDER": {
            return [...action.el.items]
        }
        case "GO-BACK-TO-FOLDER": {
            return [...action.path[action.path.length - 2].items]
        }
        default : {
            return state
        }
    }
}
export const setCurrentFolderAC = (structure: SctructureType) => ({type: 'SET-CURRENT-FOLDER', structure} as const)
export const goToFolderAC = (el: RootType) => ({type: 'GO-TO-FOLDER', el} as const)
export const goBackToFolderAC = (path: Array<RootType>) => ({type: 'GO-BACK-TO-FOLDER', path} as const)
export const fetchCurrentFolderTC = () => {
    return (dispatch: Dispatch<ActionsType>) => {
        dispatch(setUpStatusAC('loading'))
        api.getStructure()
            .then((res) => {
                dispatch(setCurrentFolderAC(res.data))
                dispatch(setUpStatusAC('succeeded'))
                dispatch(setErrorAC(null))
            })
            .catch((err) => {
                dispatch(setUpStatusAC('failed'))
                dispatch(setErrorAC(err.message))
            })
    }
}