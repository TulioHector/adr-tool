import fetch from 'isomorphic-fetch';
import IAPI, { IFile, FileResponse } from './IAPI';

class GitHubAPI implements IAPI {
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.baseUrl = 'https://api.github.com';
  }

  async getUserInfo(username: string) {
    const url = `${this.baseUrl}/users/${username}`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  async getRepositories(username: string) {
    const url = `${this.baseUrl}/users/${username}/repos`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  async getRepositoryContents(owner: string, repo: string, path: string) {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  async getFileContent(url: string): Promise<IFile | null> {
    const API_BASE_URL = `https://cors-anywhere.herokuapp.com/${url}`;
    console.log("API_BASE_URL", API_BASE_URL);
    const response = await this._fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const fileContent = await response.text();

    return {
      content: fileContent,
    };
  }

  async getFilesADR(owner: string, repo: string, path: string): Promise<ADR[]> {
    const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    const markdownFiles = data.filter((file: any) => file.type === 'file' && file.name.endsWith('.md'));
    const fileContentPromises = markdownFiles.map(async (file: any) => {
      const contentRes = await fetch(file.download_url);
      const content = await contentRes.text();
      return {
        title: file.name,
        content,
      };
    });
    const fileContents = await Promise.all(fileContentPromises);
    return fileContents;
  }

  async _fetch(url: string) {
    const headers = {
      'Authorization': `token ${this.token}`
    };
    const response = await fetch(url, {
      headers
    });
    return response;
  }
}

export default GitHubAPI;
