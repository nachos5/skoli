import React from 'react';
import Head from 'next/head'

import './Layout.scss';

export default function Home({ children, title }) { // eslint-disable-line
  return (
    <div className="container-fluid">
      <Head>
        <title>{title}</title>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
      </Head>
      <main>
        <header>
          <h1>{title}</h1>
        </header>
        {children}
      </main>
    </div>
  )
}