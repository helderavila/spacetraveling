/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
// import { GetStaticProps } from 'next';

import { useState } from 'react';
import Link from 'next/link'
import Prismic from '@prismicio/client'
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import { getPrismicClient } from '../services/prismic';

import styles from './home.module.scss';

import Header from '../components/Header';
import { GetStaticProps } from 'next';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {

  const [posts, setPosts] = useState<PostPagination>({
    ...postsPagination,
    results: postsPagination.results.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    })),
  });


  async function loadMorePosts(): Promise<void> {
    const response = await fetch(`${posts.next_page}`).then(data =>
      data.json()
    );

    const postsResponseResults = response.results.map(post => ({
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    }));

    const newPosts = {
      ...posts,
      next_page: response.next_page,
      results: [...posts.results, ...postsResponseResults],
    };

    setPosts(newPosts);
  }
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.results.map(post => (
            <Link key={post.uid} href={`/post/${post.uid}`}>
              <div className={styles.post}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <footer className={styles.postInfo}>
                  <div>
                    <FiCalendar />
                    <time>{format(
                      new Date(post.first_publication_date),
                      "d LLLL yyyy",
                      {
                        locale: ptBR,
                      }
                    )}</time>
                  </div>
                  <div>
                    <FiUser />
                    <p>{post.data.author}</p>
                  </div>
                </footer>
              </div>
            </Link>
          ))}
        </div>
        {posts.next_page && (
          <button type="button" onClick={loadMorePosts}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      pageSize: 2, // posts per page
      ref: previewData?.ref ?? null,
    }
  );

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: postsResponse.results,
  };

  return {
    props: {
      postsPagination,
      preview,
    },
    revalidate: 60 * 5, // 5 minutes
  };
};
