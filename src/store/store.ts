import {AnyAction, applyMiddleware, combineReducers, legacy_createStore} from "redux";
import {FoldersReducer} from "./folders-reducer";
import thunkMiddleware, {ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {PathReducer} from "./path-reducer";


const rootReducer = combineReducers({
    folders: FoldersReducer,
    path: PathReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))

export type AppRootStateType = ReturnType<typeof rootReducer>
// создаем тип диспатча который принимает как AC так и TC
export type AppThunkDispatch = ThunkDispatch<AppRootStateType, any, AnyAction>

export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector


// @ts-ignore
window.store = store