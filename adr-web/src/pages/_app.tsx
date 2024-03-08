import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from 'next/head'
import GitContext from '../components/GitContext';

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [repositoryName, setRepositoryName] = useState<string | null>(null);

  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, [router.events]);

  return (
    <>
      <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <GitContext.Provider value={{ username, repositoryName, setUsername, setRepositoryName }}>
        <SessionProvider session={pageProps.session}>
          <div className="d-flex flex-column h-100">
            <Header />
            <div className="container-fluid my-3">
              <div className="row">
                <Sidebar />
                <main className="col-md-9">
                  <Component {...pageProps} />
                </main>
              </div>
            </div>
            <Footer />
          </div>
        </SessionProvider>
      </GitContext.Provider>

    </>
  );
}

export default App;