/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
// import { GetStaticProps } from 'next';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client'
import { getPrismicClient } from '../services/prismic';

// import commonStyles from '../styles/common.module.scss';

import styles from './home.module.scss';

import Header from '../components/Header';

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
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.posts}>
          {postsPagination.results.map(post => (
            <a key={post.uid} className={styles.post}>
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
            </a>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query([
    Prismic.predicates.at('document.type', 'posts')
  ], {
    fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
    pageSize: 100,
  })

  const posts = response.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author
      }
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: 2,
        results: posts
      }
    }
  }
};
