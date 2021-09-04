import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';
import { useState } from 'react';

import { Footer } from '../../components/Footer';
import { Pagination } from '../../components/Pagination';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  banner: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
  post: string;
  prevpost: string[];
  nextpost: string[];
}

export default function Posts({
  posts, post, prevpost, nextpost,
}: PostsProps) {
  const [allPosts, setAllPosts] = useState(posts);
  const [page, setPage] = useState(1);

  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`}>
              <a>
                <div>
                  <span>
                    <time>{post.updatedAt}</time>
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </span>
                  <img src={post.banner} alt={post.title} />
                </div>
              </a>
            </Link>
          ))}
        </div>
        <Pagination
          totalCountOfRegisters={posts.length}
          currentPage={page}
          onPageChange={setPage}
        />
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async (
  { params, preview = null, previewData = {} },
) => {
  const { ref } = previewData;
  const prismic = getPrismicClient();

  const post = await prismic.getByUID('post', params.uid, ref
    ? { ref }
    : null) || {};

  const prevpost = (await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      pageSize: 1,
      // after: `${post.id}`,
      orderings: '[my.post.date desc]',
    },
  )).results[0] || 'undefined';

  const nextpost = (await prismic.query(
    Prismic.Predicates.at('document.type', 'post'),
    {
      pageSize: 1,
      // after: `${posts.}`,
      orderings: '[my.post.date]',
    },
  )).results[0] || 'undefined';

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content', 'post.banner'],
      orderings: '[my.post.date desc]',
      pageSize: 10,
      page: 1,
    },
  );

  const posts = response.results.map((post) => ({
    slug: post.uid,
    banner: post.data.banner.url,
    title: RichText.asText(post.data.title),
    excerpt:
      post.data.content.find(
        (content: { type: string }) => content.type === 'paragraph',
      )?.text ?? '',
    updatedAt: new Date(post.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  }));

  return {
    props: {
      posts,
    },
  };
};
