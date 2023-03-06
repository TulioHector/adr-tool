import { useState, useEffect } from 'react';

function Repos() {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetch('https://api.github.com/users/YOUR_USERNAME/repos')
      .then((res) => res.json())
      .then((data) => setRepos(data));
  }, []);

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-3">Repositorios</h1>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {repos.map((repo) => (
                    <tr key={repo.id}>
                      <td>{repo.name}</td>
                      <td>{repo.description}</td>
                      <td>
                        <a href={repo.html_url} target="_blank" rel="noreferrer">
                          {repo.html_url}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Repos;
