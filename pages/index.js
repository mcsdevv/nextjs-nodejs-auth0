import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import parseJwt from '../lib/parseJwt';

export default () => {
  const router = useRouter();
  const { id, logout, token } = router.query;
  const [auth, setAuth] = useState(false);
  const [profile, setProfile] = useState(undefined);
  useEffect(() => {
    function getAuth() {
      if (token) {
        Cookies.set('token', token, { expires: 1 });
        Cookies.set('id', id, { expires: 1 });
      }
      if (logout) {
        Cookies.remove('token');
        Cookies.remove('id');
      }
      router.replace('/');
      const isAuth = Cookies.get('token');
      const newProfile = parseJwt(Cookies.get('id'));
      setAuth(!!isAuth);
      setProfile(newProfile);
      return null;
    }
    getAuth();
  }, [id, logout, token]);
  console.log('AUTH', auth);
  console.log('PROFILE', profile);
  return (
    <main>
      <h1>Hello World</h1>
      <Link href={`/api/auth/${!auth ? 'login' : 'logout'}/`}>
        <a>
          <button>{!auth ? 'Login' : 'Logout'}</button>
        </a>
      </Link>
      <Link href="/api/data/secret/">
        <a>
          <button>Secret Data</button>
        </a>
      </Link>
    </main>
  );
};