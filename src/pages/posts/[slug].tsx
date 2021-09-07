import Prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { RichText } from 'prismic-dom';

import { Footer } from '../../components/Footer';
import { getPrismicClient } from '../../services/prismic';
import styles from './post.module.scss';

type PostDataProps = {
    slug: string;
    banner?: string;
    title: string;
    content: string;
    updatedAt: string;
};

type PostProps = {
  post: PostDataProps;
  prevPost: PostDataProps[];
  nextPost: PostDataProps[];
}

export default function Post({ post, prevPost, nextPost }: PostProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <img src={post.banner} alt={post.title} />
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
        <div className={styles.prevNextContainer}>
          <span>
            {prevPost.map((ppost) => (
              <Link href={`/posts/${ppost.slug}`} key={ppost.slug}>
                <a>
                  {ppost.title}
                  <p>
                    {ppost.slug}
                  </p>
                </a>
              </Link>
            ))}
          </span>
          <span>
            {nextPost.map((npost) => (
              <Link href={`/posts/${npost.slug}`} key={npost.slug}>
                <a>
                  {npost.title}
                  <p>
                    {npost.slug}
                  </p>
                </a>
              </Link>
            ))}

          </span>
        </div>
      </main>
      <Footer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    };
  }

  const prismic = getPrismicClient(req);

  // Dados para carregar dados de post aterior
  const response = await prismic.getByUID('post', String(slug), { });

  const prev = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ], {
    fetch: ['post.title', 'post.content', 'post.banner'],
    after: `${response.id}`,
    orderings: '[my.post.date desc]',
    pageSize: 1,
  });
  const prevPost = prev.results.map((prevpost) => ({
    slug,
    first_publication_date: prevpost.first_publication_date,
    data: {
      title: prevpost.data.title,
    },
  }));

  // Dados para preencher post atual
  // const response = await prismic.getByUID('post', String(slug), {});
  const post = {
    slug,
    banner: response.data.banner.url,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-br',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      },
    ),
  };

  // Dados para próximo posts
  const next = await prismic.query([
    Prismic.predicates.at('document.type', 'post'),
  ], {
    fetch: ['post.title', 'post.content', 'post.banner'],
    after: `${response.id}`,
    orderings: '[my.post.date]',
    pageSize: 1,
  });
  const nextPost = next.results.map((post) => ({
    slug,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
    },
  }));

  return {
    props: {
      prevPost, nextPost, post,
    },
  };
};
