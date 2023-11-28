import React, {useState, useEffect} from 'react';
import { Component } from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

import { PolarArea } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

type PieChartProps = {
  src: string;
  display_legend: bool;
}

const PieChart: Component<PieChartProps> = ({
  src,
  display_legend=true,
}) => {

  const [pieData, setPieData] = useState();
  const [gotData, setGotData] = useState(false);

  const fetchGraphData = () => {
    fetch(src)
      .then((res) => {
        if (!res.ok) {
          // Check for 404 or other error status
          if (res.status === 404) {
            throw new Error('Not Found');
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.json()
      })
      .then((data) => {
        const updateConfig = {...configOptions};
        updateConfig.labels = data.items.map(obj => {
          if(obj.gender){
            return obj.gender;
          } else if (obj.marital_status) {
            return obj.marital_status;
          } else if (obj.emplyee_status) {
            return obj.emplyee_status;
          } else if (obj.manufacturer) {
            return obj.manufacturer;
          }
        });
        updateConfig.datasets[0].data = data.items.map(obj => {
          return obj.count;
        });
        setPieData(updateConfig);
        setGotData(true);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        // Retry the fetch after a delay
        setTimeout(fetchGraphData, 1000); // Retry after 3 seconds (adjust as needed)
      });
  }
  
  useEffect(() => {
    fetchGraphData();
  }, []);
  useEffect(() => {
  }, [pieData]);


  return(
    (pieData ?
      (
         <PolarArea 
          data={pieData} 
          options={ {
            plugins: {
              legend: {
                display: display_legend,
              }
            }
          }}
         />
      ) :
      (
        <div>loading</div>
      )
    )
  );
}
export default PieChart;

export const configOptions = {
  labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
  datasets: [
    {
      label: 'count ',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
        'rgba(75, 192, 192, 0.5)',
        'rgba(153, 102, 255, 0.5)',
        'rgba(255, 159, 64, 0.5)',
      ],
      borderWidth: 1,
    },
  ],
};
