import fetch from 'isomorphic-fetch';

interface IFile {
  content: string;
}

class GitHubAPI {
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
