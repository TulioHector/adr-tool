type Doc = {
    name: string;
    path: string;
    type: 'file' | 'dir';
    size?: number;
    content?: string;
    last_modified: string;
  }