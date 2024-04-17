import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('query');
  const columns = request.nextUrl.searchParams.get('columns');
  const pages = request.nextUrl.searchParams.get('pages');
  const excludeItems = request.nextUrl.searchParams.get('excludeItems');
  const collectionItemIds =
    request.nextUrl.searchParams.get('collectionItemIds');
  const filter = request.nextUrl.searchParams.get('filter');

  return new Response(
    `${query},${columns},${pages},${excludeItems},${collectionItemIds},${filter}`,
    {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': `attachment; filename="search_results.csv"`,
      },
    }
  );
}
