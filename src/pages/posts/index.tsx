import Prismic from '@prismicio/client';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { RichText } from 'prismic-dom';

import { Footer } from '../../components/Footer';
import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  banner?: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
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
      </main>
      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content', 'post.banner'],
      pageSize: 100,
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
