import React from "react";
import {backgroundColors, borderColors} from "../data/constants";

export function PreGraphic({scores, titles}) {



  return <div className="pre-graphic-container">
    <ul>
      {
        scores.map((score, index) => {
          return (
            <li key={titles[index]}>
              <div
                className="pre-graphic-title"
                style={{
                  backgroundColor: backgroundColors[index],
                  border: `1px solid ${borderColors[index]}`
                }}
              >
                {titles[index]}
              </div>
              <div className="pre-graphic-score"
                   style={{
                     backgroundColor: backgroundColors[index],
                     border: `5px solid ${borderColors[index]}`,
                     color: borderColors[index]
                   }}
              >
                {scores[index]}
              </div>
            </li>
          );
        })
      }
    </ul>
  </div>;
}
