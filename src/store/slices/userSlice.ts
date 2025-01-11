import {createSlice,PayloadAction} from '@reduxjs/toolkit'
import {User} from '@/types/user'

interface UserState{
    currentUser:User|null
}

const initialState:UserState={
    currentUser:null
}

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        setUser(state,action:PayloadAction<User>){
            state.currentUser=action.payload
        }
    }
})

export const {setUser}=userSlice.actions
export default userSlice.reducer;