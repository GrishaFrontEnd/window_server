// import { Injectable, InternalServerErrorException } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import { Item } from './entities/item.entity';
// import { ItemSearchBody } from './itemsSearchBody.interface';
// import { ItemsSearchResult } from './itemsSearchResult.interface';

// @Injectable()
// export class ItemSearchService {
//   index = 'items';
//   constructor(private readonly elasticSearchService: ElasticsearchService) {}
//   async indexPost(item: Item) {
//     return this.elasticSearchService
//       .index<ItemsSearchResult, ItemSearchBody>({
//         index: this.index,
//         body: {
//           id: item.id,
//           item: {
//             title: item.title,
//             price: item.price,
//             category_id: item.category_id,
//           },
//         },
//       })
//       .then((response) => {
//         return response;
//       })
//       .catch((error) => {
//         throw new InternalServerErrorException('Elasticsearch Error');
//       });
//   }
//   async search(text: string) {
//     return await this.elasticSearchService
//       .search<ItemsSearchResult>({
//         index: this.index,
//         body: {
//           query: {
//             multi_match: {
//               query: text,
//               fields: ['title'],
//             },
//           },
//         },
//       })
//       .then((response) => {
//         const hits = response.hits.hits;
//         return hits.map((item) => item._source);
//       })
//       .catch((error) => {
//         throw new InternalServerErrorException('Elasticsearch Error');
//       });
//   }
// }
