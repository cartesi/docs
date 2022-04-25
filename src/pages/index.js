import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from './index.module.css';

const features = [
  {
    title: <>New to the Blockchain OS</>,
    imageUrl: 'docs/category/new-to-cartesi',
    description: (
      <>Learn the basics of the Blockchain OS</>
    ),
  },

  {
    title: <>Build DApps</>,
    imageUrl: 'docs/category/build-dapps',
    description: (
      <>Learn how to create your first Python DApp</>
    ),
  },

  {
    title: <>Cartesi Rollups</>,
    imageUrl: 'docs/category/cartesi-rollups',
    description: (
      <>Learn how to use Cartesi Optimistic Rollups to build your DApp</>
    ),
  },

  {
    title: <>Cartesi Machine</>,
    imageUrl: 'docs/category/cartesi-machine',
    description: (
      <>Learn how Catesi Machine works and what advantages you can get from it</>
    ),
  },

{
  title: <>Descartes SDK</>,
  imageUrl: 'docs/category/descartes-sdk',
  description: (
    <>Use the SDK without performing any logic on the blockchain itself</>
  ),
},

];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <Link className="navbar__link" to={imgUrl}>
          <div className="card">
            <div className="card__header">
              <h3>{title}</h3>
            </div>
            <div className="card__body">
              <p>{description}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Homepage" description="Cudos">
      {/* <header className={clsx("hero hero--primary", styles.heroBanner)}> */}
      {/* <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p> */}
      {/* <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div> */}
      {/* </div> */}
      {/* </header> */}
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
            <div class="alert alert--primary" role="alert">
                        <center>
                        <h2> Welcome to Cartesi Documentation</h2></center>
                        </div>
                        &nbsp;
              <div className="row cards__container">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
