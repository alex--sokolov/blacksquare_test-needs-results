import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {backgroundColors, borderColors} from "../data/constants";
import {useCurrentWidth} from "../hooks/useCurrentWidth";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);



export function Graphic(props) {


  const width = useCurrentWidth();
  const ticksFontSize = width > 768 ? 16 : width > 500 ? 10 : width > 350 ? 7 :5;


  const options = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Диаграмма ваших результатов",
        font: {
          size: 20
        },
        padding: {
          bottom: 50
        }
      },
      label: {
        fontSize: '10px'
      }
    },
    scales: {
      y: {
        min: 0,
        max: 25,
        ticks: {
          font: {
            size: 20,
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: ticksFontSize,
          }
        }
      }
    },
  };



  const data = {
    // labels: ['', '', '', '', '', '', ''],
    labels: props.names,
    datasets: [
      {
        data: props.scores,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      },
    ]
  };

  return <Bar options={options} data={data} />;
}
