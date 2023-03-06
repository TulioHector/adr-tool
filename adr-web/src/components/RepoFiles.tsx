import { useState, useEffect } from 'react';

function RepoFiles({ repoName, folderPath }) {
  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://api.github.com/repos/YOUR_USERNAME/${repoName}/contents/${folderPath}?per_page=${pageSize}&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setIsLoading(false);
      });
  }, [repoName, folderPath, page]);

  const handlePrevClick = () => setPage((prev) => prev - 1);
  const handleNextClick = () => setPage((prev) => prev + 1);

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (!files.length) {
    return <p>No hay archivos en esta carpeta.</p>;
  }

  return (
    <div className="container-fluid">
      <h1 className="h3 mb-3">{folderPath}</h1>
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tamaño</th>
                    <th>Tipo</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.name}>
                      <td>
                        <a href={file.html_url} target="_blank" rel="noreferrer">
                          {file.name}
                        </a>
                      </td>
                      <td>{file.size}</td>
                      <td>{file.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="d-flex justify-content-center mt-3">
            <nav aria-label="Page navigation example">
              <ul className="pagination">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handlePrevClick}>
                    Anterior
                  </button>
                </li>
                <li className={`page-item ${page === 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(1)}>
                    1
                  </button>
                </li>
                {files.length === pageSize && (
                  <li className={`page-item ${page === 2 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(2)}>
                      2
                    </button>
                  </li>
                )}
                <li className={`page-item ${page === 3 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(3)}>
                      3
                    </button>
                  </li>
                )}
                {files.length === pageSize && (
                  <li className={`page-item ${page === 4 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => setPage(4)}>
                      4
                    </button>
                  </li>
                )}
                <li className={`page-item ${page === 5 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setPage(5)}>
                    5
                  </button>
                </li>
                <li className={`page-item ${page === 5 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={handleNextClick}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
