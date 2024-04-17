// import { flatten } from 'lodash';
// import { MetadataRoute } from 'next';
// import slugify from 'slugify';

// import ROUTES from '@/constants/routes';
// import { explore } from '@/services/backend';

// const ITEMS_PER_SITEMAP = 5000; // google's limit is 50,000 URLs per sitemap
// const MAX_ITEMS_BACKEND = 100;
// const GET_ALL_FILTER = 'year > 0 OR IS_NULL(year)';

// export async function generateSitemaps() {
//   // fetch the total number of items and calculate the number of sitemaps needed
//   const items = await explore({
//     limit: 1, // we only need the total number of items
//     offset: 0,
//     filter: GET_ALL_FILTER,
//   });
//   return Array.from({
//     length: Math.ceil(items.payload.total_hits / ITEMS_PER_SITEMAP),
//   }).map((_, i) => ({
//     id: i,
//   }));
//   //   return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
// }

// /**
//  *
//  * @remarks this function is more complex because the backend has a items limit of 100, and we want
//  * each sitemap to have 50,000 items, as the sitemap index can only have 500 items
//  */
// export default async function sitemap({
//   id,
// }: {
//   id: number;
// }): Promise<MetadataRoute.Sitemap> {
//   const start = id * ITEMS_PER_SITEMAP;
//   const itemPromises = [];
//   for (let i = 0; i < ITEMS_PER_SITEMAP / MAX_ITEMS_BACKEND; i++) {
//     itemPromises.push(
//       explore({
//         limit: MAX_ITEMS_BACKEND,
//         offset: start + i * MAX_ITEMS_BACKEND,
//         filter: GET_ALL_FILTER,
//       })
//     );
//   }
//   const itemsNested = await Promise.all(itemPromises);
//   return flatten(
//     itemsNested.map((items) =>
//       items.payload.items.map((item) => ({
//         url: `${process.env.NEXT_PUBLIC_BASE_URL}${ROUTES.ITEM}/${
//           item.id
//         }/${slugify(item.title ?? '')}`,
//         lastModified: new Date(),
//       }))
//     )
//   );
// }
