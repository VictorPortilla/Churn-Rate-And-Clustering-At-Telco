import React, {useState, useEffect} from 'react';
import GraphsCard from "@/components/GraphsCard/GraphsCard";
import MapChart from "@/components/MapChart/MapChart";
import PieChart from "@/components/PieChart/PieChart";
import LineChart from "@/components/LineChart/LineChart";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function PageGraphics(){
  
    const [mapSelection, setMapSelection] = useState(0);
    const handleChange = (event: SelectChangeEvent) => {
      setMapSelection(event.target.value);
    };

    return(
      <Grid
        container 
        sx={{
          display:'flex',
          flexDirection:'row',
          justifyContent:'space-evenly',
          alignItems:'center',
        }}
      >
        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"90%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'98%'}
            >
              <FormControl
                sx={{
                  m: 1,
                  minWidth: 120,
                }}
                size="small"
              >
                <InputLabel
                  id="select-map-chart-label"
                >Map</InputLabel>
                <Select
                  labelId="select-map-chart-label"
                  id="select-map-chart"
                  value={mapSelection}
                  label="Map"
                  onChange={handleChange}
                >
                  <MenuItem value={0}>Stores</MenuItem>
                  <MenuItem value={1}>Churn</MenuItem>
                  <MenuItem value={2}>Regions</MenuItem>
                </Select>
              </FormControl>
              {mapSelection === 0 ? (
                  <iframe src={"https://www.becode.software/chart/map-1"} height={"100%"} width={"100%"} frameBorder="0"  scrolling={"no"}/>
                ) : mapSelection === 1 ?
                (
                  <iframe src={"https://www.becode.software/chart/map-1"} height={"100%"} width={"100%"} frameBorder="0"  scrolling={"no"}/>
                ): 
                (
                  <iframe src={"https://www.becode.software/chart/map-2"} height={"100%"} width={"100%"} frameBorder="0"  scrolling={"no"}/>
                )
              }
            </GraphsCard>
          </Box>
        </Grid>


        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"45%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'98%'}
            >
              <PieChart 
                src={'https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getgendercount/'}
              />
            </GraphsCard>
          </Box>
        </Grid>


        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"45%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'98%'}
            >
              <PieChart 
                src={'https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountmaritalstatus'}
              />
            </GraphsCard>
          </Box>
        </Grid>

        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"45%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'98%'}
            >
              <PieChart 
                src={'https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountemployeestatus'}
              />
            </GraphsCard>
          </Box>
        </Grid>


        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"45%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'90%'}
            >
              <PieChart 
                src={'https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountmanufacturer/?offset=0&limit=50'}
                display_legend={false}
              />
            </GraphsCard>
          </Box>
        </Grid>


        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"90%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'90%'}
            >
              <LineChart
                src={'https://g2f225dbbc50ff7-churntelcodb.adb.us-phoenix-1.oraclecloudapps.com/ords/admin/getcountactiveclientstime'}
              />
            </GraphsCard>
          </Box>
        </Grid>


        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            width:"90%",
          }}
        >
          <Box
            p={2} 
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              width:"100%",
            }}
          >
            <GraphsCard
              hh={500}
              ww={'90%'}
            >
              <iframe src={"https://www.becode.software/chart/map-3"} height={"100%"} width={"100%"} frameBorder="0"  scrolling={"no"}/>
            </GraphsCard>
          </Box>
        </Grid>

      </Grid>
    );
}
