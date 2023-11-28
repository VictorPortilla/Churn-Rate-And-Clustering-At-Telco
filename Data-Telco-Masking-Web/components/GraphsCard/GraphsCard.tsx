'use client'
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

import Box from '@mui/material/Box';
import { Component } from 'react';


type GraphProp = {
  children: React.ReactChild;
  ww: number | string;
  hh: number | string;
};
const GraphsCard: Component<GraphProp> = ({
  children,
  ww = 300,
  hh = 300,
}) => {

  return(
    <Card
      sx={{
        height: hh,
        width: ww,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
      }}
    >
      <CardContent
        sx={{
          height: "100%",
          width: "100%",
          display:'flex',
          flexDirection: "column",
          justifyContent:'center',
          alignItems:'center',
        }}
      >
          {children} 
      </CardContent>
    </Card>
  );

}
export default GraphsCard;
