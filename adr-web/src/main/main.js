import { faHome } from "@fortawesome/free-solid-svg-icons";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import configData from '../config/config.json';

function mainMenu(){
    return (
        <header>
        <div className="px-3 py-2 text-bg-dark">
          <div className="container">
            <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
              <a href="/" className="d-flex align-items-center my-2 my-lg-0 me-lg-auto text-white text-decoration-none">
                {configData.titleWebPage}
              </a>
    
              <ul className="nav col-12 col-lg-auto my-2 justify-content-center my-md-0 text-small">
                <li>
                  <a href="#" className="nav-link text-secondary">
                    
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    
                    Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    
                    Products
                  </a>
                </li>
                <li>
                  <a href="#" className="nav-link text-white">
                    
                    Customers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
      </header>
    );
}

export default mainMenu;