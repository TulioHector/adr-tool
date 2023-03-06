import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';
import type { AppProps } from 'next/app';
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    typeof document !== undefined
      ? require("bootstrap/dist/js/bootstrap")
      : null;
  }, [router.events]);
  return (
    <>
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
    </>
  );
}

export default App;