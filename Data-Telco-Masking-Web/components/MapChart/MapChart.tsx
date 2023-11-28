'use client'
import React, {useState, useEffect} from 'react';
import getStores from './actions.ts';
import { Component } from 'react';

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highchartsMap from "highcharts/modules/map";
import proj4 from "proj4";
import mapDataIE from "@highcharts/map-collection/countries/us/custom/us-all-territories.geo.json";

highchartsMap(Highcharts); // Initialize the map module

if (typeof window !== "undefined") {
  window.proj4 = window.proj4 || proj4;
}

type MapChartProps = {
  churn_map: number;
}

const MapChart: Component<MapChartProps> = ({
  churn_map = 0,
}) => {
  const [storesData, setStoresData] = useState({});
  const [gotData, setGotData] = useState(false);

  useEffect(() => {
  fetch('https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountstores/?offset=0&limit=50')
    .then((res) => res.json())
    .then((data) => {
      let modifiedArray = data.items.map(obj => {
        return { lat: obj.latittude, lon: obj.longitude, z: obj.count };
      });
      const updatedOptions = { ...mapOptions };
      updatedOptions.series[1].data = modifiedArray;
      if(churn_map === 1) {
        updatedOptions.series[1].color = "#e61c4e";
      } else {
        updatedOptions.series[1].color = "#4169E1";
      }
      setStoresData(updatedOptions);
      setGotData(true);
    })
  }, []);

  return (
    (gotData
    ? (
      <HighchartsReact 
        containerProps={{
          style:{
            height:'80%'
          }
        }}
        constructorType={"mapChart"} 
        highcharts={Highcharts} 
        options={storesData}
      />
    )
    : (
      <div>loading</div>
    )
    )
  );
}
export default MapChart;

let mapOptions = {
  chart: {
    map: "countries/us/custom/us-all-territories"
  },
  title: {
    text: "hola"
  },
  credits: {
    enabled: false
  },
  mapNavigation: {
    enabled:true 
  },
  tooltip: {
    headerFormat: "",
    pointFormat: "size: {point.z}, lat: {point.lat}, lon: {point.lon}"
  },
  series: [
    {
      // Use the gb-all map with no data as a basemap
      name: "Basemap",
      mapData: mapDataIE,
      borderColor: "#A0A0A0",
      nullColor: "rgba(200, 200, 200, 0.3)",
      showInLegend: false,
      dataLabels: {
        enabled: true,
        format: '{point.name}'
      },
    },
    {
      // Specify points using lat/lon 42.943362, -106.558026
      type: "mapbubble",
      name: "Locations",
      color: "#4169E1",
      data: [
        { z: 7500, keyword: "tw", lat: 42.943362, lon: -100.558026 },
        { z: 6000, keyword: "one", lat: 37.943362, lon: -100.558026 },
        { z: 8888, keyword: "three", lat: 48.943362, lon: -100.558026 },
        { z: 6500, keyword: "Galway", lat: 44.943362, lon: -106.558026 },
      ],
      minSize: 4,
      maxSize: '12%',
      cursor: "pointer",
      point: {
        events: {
          click: function () {
            console.log(this.keyword);
          }
        }
      }
    }
  ]
};
