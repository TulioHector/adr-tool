import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import GitHubAPI from '../../components/GitHubAPI';
import { useSession } from 'next-auth/react';

const DashboardPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [repos, setRepos] = useState([]); // creamos el estado para almacenar los repositorios
    const [loading, setLoading] = useState(true); // creamos el estado para manejar el estado de carga
    const [error, setError] = useState(null); // creamos el estado para manejar errores

    useEffect(() => {
        // función asíncrona para obtener los repositorios
        async function fetchRepos() {
            try {
                if (session) {
                    const token = session.accessToken;
                    const githubApi = new GitHubAPI(token);
                    const userName = session.user.loginName;
                    //console.log("sessions->", session);
                    const response = await githubApi.getRepositories(userName); // llamamos a la función para obtener los repositorios
                    console.log("Response", response);
                    setRepos(response); // actualizamos el estado con los repositorios
                    setLoading(false); // cambiamos el estado de carga a falso
                }
                //console.log("sessions->", session);
            } catch (error: any) {
                setLoading(false); // cambiamos el estado de carga a falso
                setError(error); // guardamos el error en el estado
            }
        }
        fetchRepos(); // llamamos a la función para obtener los repositorios al montar el componente
    }, [session]);

    // función para manejar la selección del repositorio
    function handleRepoSelect(repo: any) {
        router.push(`/repo/${repo.id}`); // navegamos a la página del detalle del repositorio
    }

    return (
        <>
            <div>
                {loading && <p>Cargando repositorios...</p>}
                {error && <p>Ocurrió un error al cargar los repositorios: {error.message}</p>}
                {!loading && !error && (
                    <div className='card-deck'>
                        {repos.map((repo) => (
                        <div className="card" key={repo.id}>
                            <img className="card-img-top" src=".../100px180/" alt="Card image cap"/>
                            <div className="card-body">
                                <h5 className="card-title"><a href={`/adr/${repo.name}?owner=${repo.owner.login}`}>{repo.name}</a></h5>
                                <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
                            </div>
                            <div className="card-footer">
                                <small className="text-muted">Last updated 3 mins ago</small>
                            </div>
                        </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
}

export default DashboardPage;