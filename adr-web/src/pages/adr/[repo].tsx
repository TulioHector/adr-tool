import { useRouter } from "next/router";
import { useState, useEffect, useContext  } from "react";
import { useSession } from 'next-auth/react';
import getAuthSessions from '../../components/GetApi';
import GitContext from '../../components/GitContext';
import ReactMarkdown from 'markdown-to-jsx';


const ShowAdrs = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { owner, repo } = router.query;
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [currentFolder, setCurrentFolder] = useState<string>('/');
    const [loading, setLoading] = useState(false); // Estado para controlar la carga
    const { setUsername, setRepositoryName } = useContext(GitContext);

    useEffect(() => {
        setLoading(true); // Cambiamos el estado a true para mostrar el mensaje de carga
        const sortFiles = (files: any) => {
            const sortedFiles = files.sort((a: any, b: any) => {
                if (a.type === 'dir' && b.type !== 'dir') {
                    return -1;
                } else if (a.type !== 'dir' && b.type === 'dir') {
                    return 1;
                } else {
                    return a.name.localeCompare(b.name);
                }
            });

            return sortedFiles;
        }
        const getDocs = async () => {
            try {
                if (session) {
                    setDocs([]); // limpia la lista de documentos
                    const userName = session.user.loginName;
                    setUsername(userName);                    
                    const githubApi = await getAuthSessions();
                    const currentRepo: string = repo?.toString() || "";
                    setRepositoryName(currentRepo);
                    if (githubApi) {
                        const res = await githubApi.getRepositoryContents(userName, currentRepo, currentFolder);
                        const filteredFiles = res.filter((file: any) => file.type === 'dir' || file.name.endsWith('.md'));
                        const data = sortFiles(filteredFiles);
                        setDocs(data);
                    }
                }
                setLoading(false); // Cambiamos el estado a false para ocultar el mensaje de carga
            } catch (error) {
                console.error(error);
            }
        };

        if (owner && repo) {
            getDocs();
        }
    }, [owner, repo, session, currentFolder,setUsername,setRepositoryName]);

    const handleDocSelect = async (doc: any) => {
        try {
            setLoading(true); // activar el loading aquí
            const githubApi = await getAuthSessions();
            console.log("Url del archivo para descargar->", doc);
            const res = await githubApi.getFileContent(doc.download_url);
            const content = res?.content;
            setSelectedDoc({
                name: doc.name,
                content,
            });
        } catch (error) {
            console.error(error);
        }
    };

    function navigateToFolder(folderPath: string) {
        console.log(folderPath);
        setDocs([]); // limpia la lista de documentos
        setCurrentFolder(folderPath);
        setLoading(true); // activar el loading aquí
    }

    return (
        <>
            <div>
                <h1>Docs for {owner}/{repo}</h1>
                <button onClick={() => navigateToFolder('/')}>Go back</button>
                {loading && <div className="clearfix">
                    <div className="spinner-border float-right" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Size</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map(doc =>
                            doc.type === 'dir' ? (
                                <tr key={doc.name} onClick={() => navigateToFolder(doc.path)}>
                                    <td>{doc.name}</td>
                                    <td><i className="bi bi-folder-fill"></i></td>
                                    <td>{doc.size} bytes</td>
                                </tr>
                            ) : (
                                <tr key={doc.name} onClick={() => handleDocSelect(doc)}>
                                    <td>{doc.name}</td>
                                    <td><i className="bi bi-file-earmark"></i></td>
                                    <td>{doc.size} bytes</td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
                {selectedDoc && (
                    <div>
                        <h2>{selectedDoc.name}</h2>
                        <ReactMarkdown options={{ wrapper: 'article', forceBlock: true }}>
                            {selectedDoc.content}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </>
    );
}

export default ShowAdrs;