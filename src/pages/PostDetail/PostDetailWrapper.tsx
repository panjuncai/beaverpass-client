import React from 'react';
import {useParams} from 'react-router-dom'
import PostDetail from './PostDetail'

const PostDetailWrapper:React.FC=()=>{
    const {postId}=useParams<{postId:string}>();
    if(!postId){
        return <div>Error: Post ID is missing.</div>
    }

    return <PostDetail postId={postId} />
}
export default PostDetailWrapper;