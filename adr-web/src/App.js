import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import { faFileEdit } from "@fortawesome/free-solid-svg-icons";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './App.css';
import { GetAdrs } from './infrastructure/github';

let adrs = GetAdrs();
console.log(adrs);
function App() {
  const listItems = adrs.map((adr, index) =>
    <li key={index} className="timeline-item mb-5">
      <span className="timeline-icon">
        <FontAwesomeIcon icon={faFileLines} />
      </span>

      <h5 className="fw-bold">{adr.name}</h5>
      <p className="text-muted mb-2 fw-bold">
        <a href="{adr.html_url}"><FontAwesomeIcon icon={faFileEdit}/></a>
        </p>
      <p className="text-muted">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit
        necessitatibus adipisci, ad alias, voluptate pariatur officia
        repellendus repellat inventore fugit perferendis totam dolor
        voluptas et corrupti distinctio maxime corporis optio?
      </p>
    </li>
  );
  return (
    <section className="p-4 p-md-5">
      <ul className="timeline-with-icons">
        {listItems}
      </ul>
    </section>
  );
}

export default App;
