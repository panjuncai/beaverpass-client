import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_POST_IMAGE,
  CREATE_POST,
  DELETE_POST,
  DELETE_POST_IMAGE,
  GET_MY_POSTS,
  GET_POST_BY_ID,
  GET_POSTS_BY_FILTER,
  GET_POSTS_BY_POSTER_ID,
  UPDATE_POST,
  UPDATE_POST_STATUS
} from '@/api/postOperations';
import {
  AddPostImageInput,
  CreatePostInput,
  DeletePostImageInput,
  Post,
  PostFilterInput,
  UpdatePostInput
} from '@/types/post';
import { Toast } from 'antd-mobile';

// 获取帖子列表（支持过滤）
export const useGetPostsByFilter = (filter?: PostFilterInput) => {
  const { data, loading, error, refetch } = useQuery<{ getPostsByFilter: Post[] }>(
    GET_POSTS_BY_FILTER,
    {
      variables: { filter: filter || {} },
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getPostsByFilter || [],
    loading,
    error,
    refetch,
  };
};

// 获取单个帖子
export const useGetPostById = (id: string|undefined) => {
  const { data, loading, error, refetch } = useQuery<{ getPostById: Post }>(
    GET_POST_BY_ID,
    {
      variables: { id },
      fetchPolicy: 'network-only',
      skip: !id
    }
  );

  return {
    post: data?.getPostById,
    isLoading: loading,
    error,
    refetch,
  };
};

// 获取用户的帖子
export const useGetPostsByPosterId = (posterId: string) => {
  const { data, loading, error, refetch } = useQuery<{ getPostsByPosterId: Post[] }>(
    GET_POSTS_BY_POSTER_ID,
    {
      variables: { posterId },
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getPostsByPosterId || [],
    isLoading: loading,
    error,
    refetch,
  };
};

// 获取当前用户的帖子
export const useGetMyPosts = () => {
  const { data, loading, error, refetch } = useQuery<{ getMyPosts: Post[] }>(
    GET_MY_POSTS,
    {
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getMyPosts || [],
    isLoading: loading,
    error,
    refetch,
  };
};

// 创建帖子
export const useCreatePost = () => {
  const [createPostMutation, { loading }] = useMutation<
    { createPost: Post },
    { input: CreatePostInput }
  >(CREATE_POST);

  const createPost = async (input: CreatePostInput) => {
    try {
      const { data } = await createPostMutation({
        variables: { input },
      });
      
      if (!data?.createPost) {
        throw new Error('创建帖子失败');
      }

      return data.createPost;
    } catch (error) {
      console.error('Create post failed:', error);
      throw error;
    }
  };

  return {
    createPost,
    isLoading: loading,
  };
};

// 更新帖子
export const useUpdatePost = () => {
  const [updatePostMutation, { loading }] = useMutation<
    { updatePost: Post },
    { input: UpdatePostInput }
  >(UPDATE_POST);

  const updatePost = async (input: UpdatePostInput) => {
    try {
      const { data } = await updatePostMutation({
        variables: { input },
      });

      if (!data?.updatePost) {
        Toast.show({
          icon: 'fail',
          content: '更新帖子失败',
        });
        throw new Error('更新帖子失败');
      }

      return data.updatePost;
    } catch (error) {
      console.error('Update post failed:', error);
      throw error;
    }
  };

  return {
    updatePost,
    isLoading: loading,
  };
};

// 更新帖子状态
export const useUpdatePostStatus = () => {
  const [updatePostStatusMutation, { loading }] = useMutation<
    { updatePostStatus: Post },
    { id: string; status: string }
  >(UPDATE_POST_STATUS);

  const updatePostStatus = async (id: string, status: string) => {
    try {
      const { data } = await updatePostStatusMutation({
        variables: { id, status },
      });

      if (!data?.updatePostStatus) {
        Toast.show({
          icon: 'fail',
          content: '更新帖子状态失败',
        });
        throw new Error('更新帖子状态失败');
      }

      return data.updatePostStatus;
    } catch (error) {
      console.error('更新帖子状态失败:', error);
      throw error;
    }
  };

  return {
    updatePostStatus,
    isLoading: loading,
  };
};

// 删除帖子
export const useDeletePost = () => {
  const [deletePostMutation, { loading }] = useMutation<
    { deletePost: Post },
    { id: string }
  >(DELETE_POST);

  const deletePost = async (id: string) => {
    try {
      const { data } = await deletePostMutation({
        variables: { id },
      });

      if (!data?.deletePost) {
        Toast.show({
          icon: 'fail',
          content: '删除帖子失败',
        });
        throw new Error('删除帖子失败');
      }

      return data.deletePost;
    } catch (error) {
      console.error('删除帖子失败:', error);
      throw error;
    }
  };

  return {
    deletePost,
    isLoading: loading,
  };
};

// 添加帖子图片
export const useAddPostImage = () => {
  const [addPostImageMutation, { loading }] = useMutation<
    { addPostImage: Post },
    { input: AddPostImageInput }
  >(ADD_POST_IMAGE);

  const addPostImage = async (input: AddPostImageInput) => {
    try {
      const { data } = await addPostImageMutation({
        variables: { input },
      });

      if (!data?.addPostImage) {
        Toast.show({
          icon: 'fail',
          content: '添加帖子图片失败',
        });
        throw new Error('添加帖子图片失败');
      }

      return data.addPostImage;
    } catch (error) {
      console.error('添加帖子图片失败:', error);
      throw error;
    }
  };

  return {
    addPostImage,
    isLoading: loading,
  };
};

// 删除帖子图片
export const useDeletePostImage = () => {
  const [deletePostImageMutation, { loading }] = useMutation<
    { deletePostImage: Post },
    { input: DeletePostImageInput }
  >(DELETE_POST_IMAGE);

  const deletePostImage = async (input: DeletePostImageInput) => {
    try {
      const { data } = await deletePostImageMutation({
        variables: { input },
      });

      if (!data?.deletePostImage) {
        Toast.show({
          icon: 'fail',
          content: '删除帖子图片失败',
        });
        throw new Error('删除帖子图片失败');
      }

      return data.deletePostImage;
    } catch (error) {
      console.error('删除帖子图片失败:', error);
      throw error;
    }
  };

  return {
    deletePostImage,
    isLoading: loading,
  };
}; 