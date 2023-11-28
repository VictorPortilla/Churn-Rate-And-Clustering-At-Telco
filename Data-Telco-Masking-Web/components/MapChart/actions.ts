import mapDataIE from "@highcharts/map-collection/countries/us/custom/us-all-territories.geo.json";
const getStores = (setStoresData: func) => {
  fetch('https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountstores/?offset=0&limit=50')
  .then((res) => res.json())
  .then((data) => {
    let modifiedArray = data.items.map(obj => {
      return { latittude: obj.latittude, longitude: obj.longitude, z: obj.count };
    });
    mapOptions.series[1].data = modifiedArray
    console.log(mapOptions);
  })
}
export default getStores;
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
      data: [],
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
