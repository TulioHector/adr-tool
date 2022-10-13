import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GetReposName } from '../infrastructure/github';

function sideBar() {
    const handleClick = async () => {
        console.log("Hola Tito estoy en otro archivo js");
    };
    let reposeName = GetReposName();
    const listItems = reposeName.map((name, index) =>
    <li key={index}>
        <a href="#" onClick={handleClick} className="nav-link text-white">
        {name}
        </a>
    </li>
    );
    return (
        <div className="row d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{ width: '280px' }}>
            <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">

                <span className="fs-4">Repositories</span>
            </a>
            <hr />
            <ul className="nav nav-pills flex-column mb-auto">
            {listItems}
            </ul>
            <hr />

        </div>
    );
}

export default sideBar;