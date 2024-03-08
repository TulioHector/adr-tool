import IAPI, {IFile } from './IAPI';
import GitHubAPI from '../components/GitHubAPI';
import GitLabAPI from '../components/GitLabAPI';
import { getSession } from 'next-auth/react';

async function getAuthSessions(): Promise<IAPI | undefined> {
    const session = await getSession();
    const token = session?.accessToken;
    const useApi = process.env.USE_API || 'github';

    let api: IAPI | undefined;
    if (useApi === "github") {
        api = new GitHubAPI(token);
    } else if (useApi === "gitlab") {
        api = new GitLabAPI(token);
    }
    
    return api;
}

export default getAuthSessions;