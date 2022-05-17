import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from './index.module.css';


const features = [
  {
    title: <>Basics of Blockchain OS</>,
    imageUrl: 'docs/category/new-to-cartesi',
    description: (
      <>A layer-2 platform for the development and deployment of scalable decentralized applications.</>
    ),
  },

  {
    title: <>Cartesi Machine</>,
    imageUrl: 'docs/category/cartesi-machine',
    description: (
      <>A solution for verifiable computation to bring mainstream scalability to DApp developers.</>
    ),
  },

  {
    title: <>Cartesi Rollups</>,
    imageUrl: 'docs/category/cartesi-rollups',
    description: (
      <>Cartesi’s version of Optimistic Rollups uses interactive fraud proofs. Develop DApps using any library for Linux.</>
    ),
  },

  {
    title: <>Build DApps</>,
    imageUrl: 'docs/category/build-dapps',
    description: (
      <>Cartesi's vision is that creating a DApp should not be too different from the general development of desktop, web, and mobile applications.</>
    ),
  },

{
  title: <>Descartes SDK</>,
  imageUrl: 'docs/category/descartes-sdk',
  description: (
    <>DApps can run heavy computations off-chain on a fully fledged Linux environment without compromising decentralization.</>
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
              <h2>{title}</h2>
            </div>
            <div className="card__body">
              <p>{description}</p>
              <br/>
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
    <Layout title="Homepage" description="Cartesi">
      <br/>
      <center>
      <h1 align="center" style={{ fontWeight: '650' }}>Welcome to the Blockchain OS Docs</h1></center>

      <main>
              {features && features.length > 0 && (
                <section className={styles.features}>
                  <div className="container">
                    <div className="row">
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
