export interface Category{
  _id:string;
  name: string;
  parentId:string|null;
  orderId:number;
  createdAt:Date;
  updatedAt:Date;
}
