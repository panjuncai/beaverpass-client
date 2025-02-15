import {createSlice,createAsyncThunk,PayloadAction} from '@reduxjs/toolkit';

export type ToastType="info"|"success"|"warning"|"error";

export interface ToastState{
    message:string;
    type:ToastType;
    duration:number;
    isVisible:boolean;
}

const initialState:ToastState={
    message:"",
    type:"info",
    duration:2000,
    isVisible:false
};

export const showToast=createAsyncThunk<void,Omit<ToastState,"isVisible">
>("toast/showToast",async (payload,{dispatch})=>{
    dispatch(setToast({...payload,isVisible:true}));

    setTimeout(()=>{
        dispatch(hideToast());
    }
    ,payload.duration);
})

const toastSlice=createSlice({
    name:'toast',
    initialState,
    reducers:{
        setToast:(state,action:PayloadAction<ToastState>)=>{
            state.message=action.payload.message;
            state.type=action.payload.type;
            state.duration=action.payload.duration;
            state.isVisible=action.payload.isVisible;
        },
        hideToast:(state)=>{
            state.isVisible=false;
        }
    },
    extraReducers:(_builder)=>{}
})

export const {setToast,hideToast}=toastSlice.actions;
export default toastSlice.reducer;