export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

const initialState = {
    status: 'idle' as RequestStatusType
}

type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        default:
            return state
    }
}


export const setUpStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)


export type setUpStatusACType = ReturnType<typeof setUpStatusAC>
export type ActionsType = setUpStatusACType
