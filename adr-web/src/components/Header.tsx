import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

function Header() {
  const { data: session, status } = useSession();
  const handleSignin = (e: any) => {
    e.preventDefault()
    signIn()
  }
  const handleSignout = (e: any) => {
    e.preventDefault()
    signOut()
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="#">Logo Here</a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <div className="navbar-nav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link href="/" className='nav-link'>
                {
                  (session?.user !== undefined && session !== null) && `${session.user.name ?? session.user.email}`
                }
              </Link>
            </li>
            <li className='nav-item'>
              {session && <a href="#" onClick={handleSignout} className="nav-link">Sign out</a>}
              {!session && <a href="#" onClick={handleSignin} className="nav-link">Sign in</a>}
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
}

export default Header;
