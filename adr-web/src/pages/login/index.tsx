import { signIn,useSession } from 'next-auth/react';

const LoginPage = () => {
    const { data: session } = useSession()

    const handleSignin = (e:any) => {
        e.preventDefault()
        signIn()
      }

    return (
        <>
        {
            !session && <button type="button" className="btn btn-dark" onClick={handleSignin}>Sign in</button>
        }        
        </>
    )
}

export default LoginPage;