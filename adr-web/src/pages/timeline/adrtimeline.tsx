import { FC } from "react";

type TimelineProps = {
    adrs: ADR[];
  };

const Timeline: FC<TimelineProps> = ({ adrs }) => {
  console.log("TimelIne array->", adrs);
    return (
      <div className="row">
        {adrs.map((adr) => (
          <div className="col-md-6" key={adr.id}>
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">{adr.title}</h5>
                <small className="text-muted">{adr.date}</small>
              </div>
              <div className="card-body">
                {/* {adr.content} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Timeline;