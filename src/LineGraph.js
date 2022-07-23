import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    point: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};


// const options = {
//   animationEnabled: true,
//   exportEnabled: true,
//   theme: "light2", // "light1", "dark1", "dark2"
//   title:{
//     text: "Bounce Rate by Week of Year"
//   },
//   axisY: {
//     title: "Bounce Rate",
//     suffix: "%"
//   },
//   axisX: {
//     title: "Week of Year",
//     prefix: "W",
//     interval: 2
//   },
//   data: [{
//     type: "line",
//     toolTipContent: "Week {x}: {y}%",
//     dataPoints: [
//       { x: 1, y: 64 },
//       { x: 2, y: 61 },
//       { x: 3, y: 64 },
//       { x: 4, y: 62 },
//       { x: 5, y: 64 },
//       { x: 6, y: 60 },
//       { x: 7, y: 58 },
//       { x: 8, y: 59 },
//       { x: 9, y: 53 },
//       { x: 10, y: 54 },
//       { x: 11, y: 61 },
//       { x: 12, y: 60 },
//       { x: 13, y: 55 },
//       { x: 14, y: 60 },
//       { x: 15, y: 56 },
//       { x: 16, y: 60 },
//       { x: 17, y: 59.5 },
//       { x: 18, y: 63 },
//       { x: 19, y: 58 },
//       { x: 20, y: 54 },
//       { x: 21, y: 59 },
//       { x: 22, y: 64 },
//       { x: 23, y: 59 }
//     ]
//   }]
// }



const buildChartData = (data, casesType) => {
  let chartData = [];
  let lastDataPoint;
  for (let date in data.cases) {
    if (lastDataPoint) {
      let newDataPoint = {
        x: date,
        y: data[casesType][date] - lastDataPoint,
      };
      chartData.push(newDataPoint);
    }
    lastDataPoint = data[casesType][date];
  }
  return chartData;
};

function LineGraph({ casesType }) {
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          let chartData = buildChartData(data, casesType);
          setData(chartData);
          console.log(chartData);
        });
    };

    fetchData();
  }, [casesType]);

  return (
    <div>
      {data?.length > 0 && (
        <Line
          data={{
            datasets: [
              {
                backgroundColor: "rgba(204, 16, 52, 0.5)",
                borderColor: "#CC1034",
                data: data,
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
}

export default LineGraph;