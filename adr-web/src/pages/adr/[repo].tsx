import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import GitHubAPI from '../../components/GitHubAPI';

const ShowAdrs = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { owner, repo } = router.query;
    const [docs, setDocs] = useState([]);
    const [selectedDoc, setSelectedDoc] = useState(null);

    useEffect(() => {
        const getDocs = async () => {
            try {
                if (session) {
                    console.log("sessions->", session);
                    const token = session.accessToken;
                    const userName = session.user.loginName;
                    const githubApi = new GitHubAPI(token);
                    const res = await githubApi.getRepositoryContents(userName, "adr-tool", "adr-cli/doc");
                    console.log(res);
                    const data = res;
                    
                    setDocs(data.filter((file) => file.type === "file"));
                }
            } catch (error) {
                console.error(error);
            }
        };

        if (owner && repo) {
            getDocs();
        }
    }, [owner, repo, session]);

    const handleDocSelect = async (doc: any) => {
        try {
            const token = session.accessToken;
            const userName = session.user.loginName;
            const githubApi = new GitHubAPI(token);
            console.log("Url del archivo para descargar->", doc);
            const res = await githubApi.getFileContent(doc.download_url);
            const content = res?.content;
            console.log("contenido->", res);
            setSelectedDoc({
                name: doc.name,
                content,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div>
                <h1>Docs for {owner}/{repo}</h1>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Type</th>
                            <th scope="col">Size</th>
                            <th scope="col">Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docs.map((doc) => (
                            <tr key={doc.name} onClick={() => handleDocSelect(doc)}>
                                <td>{doc.name}</td>
                                <td>{doc.type}</td>
                                <td>{doc.size} bytes</td>
                                <td>{new Date(doc.last_modified).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {selectedDoc && (
                    <div>
                        <h2>{selectedDoc.name}</h2>
                        <pre>{selectedDoc.content}</pre>
                    </div>
                )}
            </div>
        </>
    );
}

export default ShowAdrs;