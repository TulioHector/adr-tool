export interface IFile {
    content: string;
}
export interface FileResponse {
    name: string;
    path: string;
    type: 'file';
    content: string;
}

export default interface IAPI {
    getUserInfo(username: string): Promise<any>;
    getRepositories(username: string): Promise<any>;
    getRepositoryContents(owner: string, repo: string, path: string): Promise<any>;
    getFileContent(url: string): Promise<IFile | null>;
    getFilesADR(owner: string, repo: string, path: string): Promise<ADR[]>
}