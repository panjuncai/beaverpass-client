import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/api/axiosBaseQuery";
import {User} from '@/types/user'

export const userApi=createApi({
    reducerPath:'userApi',
    baseQuery:axiosBaseQuery({baseUrl:'/users'}),
    tagTypes:['user'],
    endpoints:(builder)=>({
        getUser:builder.query<User,string>({
            query:(id)=>({url:`/${id}`,method:'GET'}),
            providesTags:(_result,_error,id)=>[{type:'user',id}]
        })
    })
})

export const {
    useGetUserQuery
}=userApi;