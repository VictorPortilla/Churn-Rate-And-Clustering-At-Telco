import React, {useState, useEffect} from 'react';
import { Component } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

type LineChartProps = {
  src: string;
}

const LineChart : Component<LineChartProps> = ({
  src,
}) => {
  const [plotData, setPlotData] = useState();
  
  const fetchGraphData = () => {
    fetch(src)
      .then((res) => {
        if(!res.ok){
          if(res.status === 404){
            throw new Error("not found");
          } else {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
        }
        return res.json();
      })
      .then((data) => {
        const updateData = {...localData};
        updateData.datasets[0].data = data.items.map(obj => {
          return obj.active_clients;
        });
        updateData.labels = data.items.map(obj => {
          return obj.registration_month;
        });
        setPlotData(updateData);
      })
      .catch((error) => {
        console.error("Fetch error: ", error)
        setTimeout(fetchGraphData, 1000);
      });
  }

  useEffect(() => {
    fetchGraphData();
  }, []);

  return(
    (plotData ? 
      (
        <Line options={options} data={plotData} />
      ) : (
        <div>loading</div>
      )
    )
  );
}
export default LineChart;


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Chart.js Line Chart',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const localData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: [100, 140, 70, 90, 100],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};
