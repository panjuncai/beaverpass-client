import { useGetCategoriesQuery, useAddCategoryMutation } from '@/services/categoryApi';

const Post:React.FC= () => {
  const { data: categories, error, isLoading } = useGetCategoriesQuery();
  const [addCategory] = useAddCategoryMutation();

  const handleAdd = async () => {
    await addCategory({ name: '新分类' });
  };

  if (isLoading) return <div>Post Loading...</div>;
  if (error) return <div>Error occurred</div>;
  return (
    <div>
      <button onClick={handleAdd}>添加分类</button>
      <ul>
        {categories?.map((cat) => (
          <li key={cat._id}>{cat.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Post;
