import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_POST,
  DELETE_POST,
  GET_MY_POSTS,
  GET_POST_BY_ID,
  GET_POSTS_BY_FILTER,
  GET_POSTS_BY_POSTER_ID,
  UPDATE_POST,
  UPDATE_POST_STATUS
} from '@/api/postOperations';
import {
  CreatePostInput,
  PostFilterInput,
  PostListResponse,
  PostResponse,
  PostStatus,
  UpdatePostInput
} from '@/types/post';
import { Toast } from 'antd-mobile';

// 获取帖子列表（支持过滤）
export const useGetPostsByFilter = (filter?: PostFilterInput) => {
  const { data, loading, error, refetch } = useQuery<{ getPostsByFilter: PostListResponse }>(
    GET_POSTS_BY_FILTER,
    {
      variables: { filter: filter || {} },
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getPostsByFilter?.data || [],
    isLoading: loading,
    error,
    refetch,
  };
};

// 获取单个帖子
export const useGetPostById = (id: string) => {
  const { data, loading, error, refetch } = useQuery<{ getPostById: PostResponse }>(
    GET_POST_BY_ID,
    {
      variables: { id },
      fetchPolicy: 'network-only',
    }
  );

  return {
    post: data?.getPostById?.data,
    isLoading: loading,
    error,
    refetch,
  };
};

// 获取用户的帖子
export const useGetPostsByPosterId = (posterId: string) => {
  const { data, loading, error, refetch } = useQuery<{ getPostsByPosterId: PostListResponse }>(
    GET_POSTS_BY_POSTER_ID,
    {
      variables: { posterId },
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getPostsByPosterId?.data || [],
    isLoading: loading,
    error,
    refetch,
  };
};

// 获取当前用户的帖子
export const useGetMyPosts = () => {
  const { data, loading, error, refetch } = useQuery<{ getMyPosts: PostListResponse }>(
    GET_MY_POSTS,
    {
      fetchPolicy: 'network-only',
    }
  );

  return {
    posts: data?.getMyPosts?.data || [],
    isLoading: loading,
    error,
    refetch,
  };
};

// 创建帖子
export const useCreatePost = () => {
  const [createPostMutation, { loading }] = useMutation<
    { createPost: PostResponse },
    { input: CreatePostInput }
  >(CREATE_POST);

  const createPost = async (input: CreatePostInput) => {
    try {
      const { data } = await createPostMutation({
        variables: { input },
      });

      if (!data || data.createPost.code !== 0) {
        Toast.show({
          icon: 'fail',
          content: data?.createPost.msg || 'Create post failed.',
        });
        throw new Error(data?.createPost.msg || 'Create post failed.');
      }

      return data.createPost.data;
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
    { updatePost: PostResponse },
    { id: string; input: UpdatePostInput }
  >(UPDATE_POST);

  const updatePost = async (id: string, input: UpdatePostInput) => {
    try {
      const { data } = await updatePostMutation({
        variables: { id, input },
      });

      if (!data || data.updatePost.code !== 0) {
        Toast.show({
          icon: 'fail',
          content: data?.updatePost.msg || 'Update post failed.',
        });
        throw new Error(data?.updatePost.msg || 'Update post failed.');
      }

      return data.updatePost.data;
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
    { updatePostStatus: PostResponse },
    { id: string; status: PostStatus }
  >(UPDATE_POST_STATUS);

  const updatePostStatus = async (id: string, status: PostStatus) => {
    try {
      const { data } = await updatePostStatusMutation({
        variables: { id, status },
      });

      if (!data || data.updatePostStatus.code !== 0) {
        Toast.show({
          icon: 'fail',
          content: data?.updatePostStatus.msg || 'Update post status failed.',
        });
        throw new Error(data?.updatePostStatus.msg || 'Update post status failed.');
      }

      return data.updatePostStatus.data;
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
    { deletePost: PostResponse },
    { id: string }
  >(DELETE_POST);

  const deletePost = async (id: string) => {
    try {
      const { data } = await deletePostMutation({
        variables: { id },
      });

      if (!data || data.deletePost.code !== 0) {
        Toast.show({
          icon: 'fail',
          content: data?.deletePost.msg || 'Delete post failed.',
        });
        throw new Error(data?.deletePost.msg || 'Delete post failed.');
      }

      return data.deletePost.data;
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