import React from 'react';

interface IGitContext {
  username: string | null;
  repositoryName: string | null;
  setUsername: React.Dispatch<React.SetStateAction<string | null>>;
  setRepositoryName: React.Dispatch<React.SetStateAction<string | null>>;
}

const GitContext = React.createContext<IGitContext>({
  username: null,
  repositoryName: null,
  setUsername: () => null,
  setRepositoryName: () => null,
});

export default GitContext;
