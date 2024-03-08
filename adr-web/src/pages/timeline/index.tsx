import { useContext, useState, useEffect } from 'react';
import { NextPage } from "next";
import GitContext from '../../components/GitContext';
import getAuthSessions from '../../components/GetApi';
import Timeline from './adrtimeline';
import parseADRName from '../../components/AdrUtils';
import useIndexedDB from "../../components/IndexedDBManager";

const TimeLinePage: NextPage = () => {
    const { username, repositoryName } = useContext(GitContext);
    const [adrs, setAdrs] = useState<ADR[]>([]);
    const repo = repositoryName;
    const owner = username;
    const createIndexedDBManager = useIndexedDB('myDB');

    useEffect(() => {
        console.log("owner y repo->", owner, repo);
        const getDocsFromPath = async () => {
            const path = "adr-cli/doc/adr";
            const githubApi = await getAuthSessions();
            
            if (githubApi && owner && repo) {
                const cachedMarkdownFiles = await createIndexedDBManager(`adrs-${repo}`).getAll(1, 50);
                console.log("cachedMarkdownFiles->", cachedMarkdownFiles);
                if (cachedMarkdownFiles.length > 0) {
                    setAdrs(cachedMarkdownFiles);
                } else {
                    console.log("Estoy aca recuperando de la API");
                    const res = await githubApi.getFilesADR(owner, repo, path);
                    console.log("responso git", res);
                    res.filter((doc: any) => doc.title.endsWith(".md"))
                    .map((doc: any) => {
                        const parse = parseADRName(doc.title);
                        return { id: parse?.id, title: parse?.name };
                    });
                    for (const doc of res) {                        
                        await createIndexedDBManager(`adrs-${repo}`).add(doc); // agregamos cada documento a la base de datos
                    }
                    setAdrs(res);
                }
            }
        }
        if (repo && owner) {
            getDocsFromPath();
        }
    }, [owner, repo,createIndexedDBManager,adrs]);

    const handleClearData = async () => {
        await createIndexedDBManager(`adrs-${repo}`).clearData(); // limpiamos la base de datos antes de agregar nuevos datos
        setAdrs([]);
    };
    return (
        <>
            <div className="container">
                <h1 className="text-center">Architecture Decision Records</h1>
                <button onClick={handleClearData}>Clear Cache Data</button>
                <Timeline adrs={adrs} />
            </div>
        </>
    );
}

export default TimeLinePage;