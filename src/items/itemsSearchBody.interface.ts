export interface ItemSearchBody {
  id: number;
  item: {
    title: string;
    price: number;
    category_id: number;
  };
}
