type ADR = {
    id: number;
    title: string;
    date: string;
    status?: 'proposed' | 'accepted' | 'deprecated';
    tags?: string[];
    content?: string;
  }