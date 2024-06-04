// import { generateSitemaps } from '@/app/sitemap';

// const generateSitemapLink = (url: string) =>
//   `<sitemap><loc>${url}</loc></sitemap>`;

// /**
//  *
//  * @remarks: the sitemap_index.xml can be removed once NextJS provides a solution for this
//  * See: https://github.com/vercel/next.js/pull/61391
//  */
// export async function GET() {
//   const pages = await generateSitemaps();

//   const sitemapIndexXML = `<?xml version="1.0" encoding="UTF-8"?>
//     <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//         ${Array.from({ length: pages.length }, (_, i) => i + 1)
//           .map((id) =>
//             generateSitemapLink(
//               `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap/${id}.xml`
//             )
//           )
//           .join('')}
//     </sitemapindex>`;

//   return new Response(sitemapIndexXML, {
//     headers: { 'Content-Type': 'text/xml' },
//   });
// }
