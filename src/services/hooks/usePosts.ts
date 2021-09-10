import { useQuery, UseQueryOptions } from 'react-query';

type Post = {
  slug: string;
}

export async function getPosts(page: number) {
  return {

  };
}

export function usePosts(page: number) {
  return useQuery(['posts', page], () => getPosts(page));
}
