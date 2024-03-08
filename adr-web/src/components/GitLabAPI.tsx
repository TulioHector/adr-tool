import fetch from 'isomorphic-fetch';
import IAPI, {IFile } from './IAPI';

class GitLabAPI implements IAPI{
  private token: string;
  private baseUrl: string;

  constructor(token: string) {
    this.token = token;
    this.baseUrl = 'https://gitlab.com/api/v4';
  }

  async getUserInfo(username: string) {
    const url = `${this.baseUrl}/users?username=${username}`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const users = await response.json();
    return users[0];
  }

  async getRepositories(username: string) {
    const url = `${this.baseUrl}/users/${username}/projects`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  }

  async getRepositoryContents(owner: string, repo: string, path: string) {
    const url = `${this.baseUrl}/projects/${owner}/${repo}/repository/tree?path=${path}&ref=master`;
    const response = await this._fetch(url);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    console.log("response->", response);
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
      'Authorization': `Bearer ${this.token}`
    };
    const response = await fetch(url, {
      headers
    });
    return response;
  }
}

export default GitLabAPI;
