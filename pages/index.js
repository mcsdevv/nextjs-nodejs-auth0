import { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Cookies from 'js-cookie';
import parseJwt from '../lib/parseJwt';

export default () => {
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(() => {
    function getAuth() {
      if (Cookies.get('id_token')) {
        setAuth(true);
        setProfile(parseJwt(Cookies.get('id_token')));
        return null;
      }
    }
    getAuth();
  }, []);
  const getSecret = async () => {
    const res = await fetch('/api/data/secret');
    const secret = await res.text();
    const newProfile = { ...profile, secret };
    setProfile(newProfile);
  };
  const logout = async () => {
    const res = await fetch('/api/auth/logout');
    if (res.status === 200) {
      Cookies.remove('id_token');
      setAuth(false);
      setProfile(null);
    }
  };
  return (
    <>
      <Head>
        <title>Next.js + Node.js + Auth0</title>
        <link
          rel="stylesheet"
          href="https://css.zeit.sh/v1.css"
          type="text/css"
        />
      </Head>
      <main>
        <h1>Next.js + Node.js + Auth0</h1>
        <div className="buttons">
          <button onClick={getSecret}>Tell Me a Secret!</button>
          {!auth ? (
            <Link href={'/api/auth/login/'}>
              <a>
                <button>Login</button>
              </a>
            </Link>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </div>
        {profile && profile.secret && <p>{profile.secret}</p>}
      </main>
      <style jsx>{`
        .buttons {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </>
  );
};
