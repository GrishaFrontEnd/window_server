import { ItemSearchBody } from './itemsSearchBody.interface';

export interface ItemsSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: ItemSearchBody;
    }>;
  };
}
