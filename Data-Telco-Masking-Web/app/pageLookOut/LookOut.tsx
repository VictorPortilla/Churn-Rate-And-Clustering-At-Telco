import React, {useState, useEffect} from 'react';
import { Component } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Container, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { encryptNDI } from "./actions.ts";

type LookOutProps = {

}
const LookOut = () => {

  const [searchTerm, setSearchTerm] = useState();
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function indexArrayByClusterNumber(array) {
    return array.reduce((index, obj) => {
      index[obj.cluster_number] = obj;
      return index;
    }, {});
  }

  const supabase = createClientComponentClient()

  const [clientData, setClientData] = useState({});
  const [riskChurn, setRiskChurn] = useState();
  const [loading, setLoading] = useState(true);
  const fetchDNIclient = async () => {
    const hashedDNI = await encryptNDI(searchTerm);
    console.log(hashedDNI);
    await fetch("https://www.becode.software/api/lgmb/dni_predict", {
      method: 'POST',
      body: JSON.stringify({
        "DNI": hashedDNI
      }),
      headers: {
        'content-type': 'application/json'
      },
    }).then((res)=>{
      if (!res.ok) {
        // Check for 404 or other error status
        if (res.status !== 404) {
          throw new Error('Not Found');
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      }
      return res.json()
    }).then((data) => {
      console.log(data);
      setClientData(data); 
      if(data.prediction_lgbm[0] > 0.85){
        setRiskChurn({
          text: "Low",
          color: "green"
        });
      }else if(data.prediction_lgbm[0] <= 0.85 & data.prediction_lgbm[0] > 0.70){
        setRiskChurn({
          text: "Moderate",
          color: "yellow"
        });
      }else if(data.prediction_lgbm[0] <= 0.70 & data.prediction_lgbm[0] > 0.50){
        setRiskChurn({
          text: "High",
          color: "orange"
        });
      }else{
        setRiskChurn({
          text: "Critical",
          color: "red"
        });
      }
      setLoading(false);
    })
  }
  useEffect(()=>{
    if(loading===false){
      // fetchLlamaRecommendation();
    }
  }, [loading]); 

  const [kClusters, setKClusters] = useState();
  const [descriptionArr, setDescriptionArr] = useState();
  const fetchClusters = async () => {
    const {data: {user}} = await supabase.auth.getUser();
      if(!user){
        alert("Unable to fetch session");
        return
      }
    const {data, error} = await supabase.from("users_associated_clusters").select("*").eq("user_id", user.id)
    if(error){
      alert("Error fetching associated clustsers");
      return
    }
    const indexedClusters = indexArrayByClusterNumber(data);
    const dsArr = Object.values(indexedClusters).map(obj => obj.cluster_description);
    console.log(dsArr);
    setDescriptionArr(dsArr);
    console.log(indexedClusters);
    setKClusters(indexedClusters);
  }
  useEffect(() => {
    fetchClusters();
  }, []);

  const [llamaRecom, setLlamaRecom] = useState("Recommendation");
  const fetchLlamaRecommendation = async () => {
    await fetch("https://www.becode.software/api/llama/salesman", {
      method: 'POST',
      body: JSON.stringify({
        "labels" : descriptionArr,
        "prediction_kmeans": clientData.prediction_kmeans[0],
        "prediction_lgbm": clientData.prediction_lgbm[0]
      }),
      headers: {
        'content-type': 'application/json'
      },
    }).then((res)=>{
      if (!res.ok) {
        // Check for 404 or other error status
        if (res.status !== 404) {
          throw new Error('Not Found');
        } else {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
      }
      return res.json()
    }).then((data) => {
      setLlamaRecom(data); 
    })
  }
  useEffect(() => {
  }, [llamaRecom]);

  return(
      <Grid
        container 
        sx={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          height: '95%',
        }}
      >
        <Grid
          item
          sx={{
            display:'flex',
            flexDirection:'row',
            justifyContent:'center',
            alignItems:'center',
            height: '20%',
            width:'90%',
          }}
        >
          <Box
            sx={{
              display:'flex',
              justifyContent:'center',
              alignItems:'center',
              height:"100%",
              width:"100%",
            }}
          >
            <Card
              sx={{
                height: '80%',
                width: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <CardContent
                sx={{
                  height: '100%',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Container
                  sx = {{
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <TextField
                    id="search"
                    type="search"
                    label="Search"
                    value={searchTerm}
                    onChange={handleChange}
                    sx={{ 
                      width: '80%',
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  /> 
                  <Button 
                    variant="contained"
                    sx={{ 
                      bgcolor: "#CC0841",
                      '&:hover': {
                        backgroundColor: '#A70433'
                      }
                    }}
                    onClick={()=>{
                      fetchDNIclient();
                    }}
                  >
                    LookOut 
                  </Button>
                </Container>
              </CardContent>
            </Card>
          </Box>
        </Grid>




        <Grid
          item
          sx={{
            display:'flex',
            justifyContent:'center',
            alignItems:'center',
            height: '80%',
            width:'90%',
          }}
        >
          <Box
            sx={{
              display:'flex',
              flexDirection:'row',
              justifyContent:'center',
              alignItems:'center',
              height: '100%',
              width:"100%",
            }}
          >
            <Card
              sx={{
                height: '95%',
                width: '90%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Grid
                sx={{
                  width: '100%', 
                  height: '100%', 
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <Box
                  sx={{
                    width: '30%', 
                    height: '100%', 
                  }}
                >
                  <Grid
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box
                      sx={{
                        width: '100%',
                        height: '60%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                    {loading ? (
                      <Avatar 
                        alt="Remy Sharp" 
                        src="https://winaero.com/blog/wp-content/uploads/2018/08/Windows-10-user-icon-big.png"
                        sx={{
                          width: '15vw',
                          height: '15vw',
                          borderRadius: '100%',
                        }}
                      />
                    ) : (
                      <Avatar 
                        alt="Remy Sharp" 
                        src={clientData.user_data.image}
                        sx={{
                          width: '15vw',
                          height: '15vw',
                          borderRadius: '100%',
                        }}
                      />
                    )}
                    </Box>
                    <Box
                      sx={{
                        width: '100%',
                        height: '40%',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant='h5'
                        gutterBottom
                      > 
                          Client
                      </Typography>
                    </Box>
                  </Grid>
                </Box>

                <Box
                  sx={{
                    width: '70%', 
                    height: '100%', 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Grid
                    sx={{
                      width: '98%',
                      height: '92%',
                    }}
                  >
                    <Box
                      sx={{
                        height: '60%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="Name"
                            id="filled-size-normal"
                            variant="filled"
                            value={loading ? ("loading") : (clientData.user_data.name)}
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="LastName"
                            id="filled-size-normal"
                            value={loading ? ("loading") : (clientData.user_data.last_name)}
                            variant="filled"
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="Location"
                            id="filled-size-normal"
                            value={loading ? ("loading") : (clientData.user_data.location)}
                            variant="filled"
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                              backgroundColor: loading ? "gray" : riskChurn.color,
                            }}
                            label="Churn Risk"
                            id="filled-size-normal"
                            variant="filled"
                            value={loading ? ("loading") : (`${riskChurn.text} - ${Math.round((1 - clientData.prediction_lgbm[0]) * 10000) / 10000}`)}
                          />
                        </Grid>
                      </Box>
                      <Box
                        sx={{
                          height: '100%',
                          width: '50%',
                          display: 'flex',
                          flexDirection: 'column',
                        }}
                      >
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="Phone"
                            id="filled-size-normal"
                            value={loading ? ("loading") : (clientData.user_data.phone_number)}
                            variant="filled"
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="email"
                            id="filled-size-normal"
                            value={loading ? ("loading") : (clientData.user_data.email)}
                            variant="filled"
                          />
                        </Grid>
                        <Grid
                          item
                          sx={{
                            width: '100%',
                            paddingBottom: '10%',
                          }}
                        >
                          <TextField
                            disabled
                            sx={{
                              width: '90%',
                            }}
                            label="Type of User"
                            id="filled-size-normal"
                            value={loading ? ("loading") : (kClusters[clientData.prediction_kmeans[0]].cluster_title) }
                            variant="filled"
                          />
                        </Grid>
                      </Box>
                      
                    </Box>
                    <Box
                      sx={{
                        height: '40%',
                        width: '100%',
                      }}
                    >

                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                              height: "100%",
                            }}
                          >
                            <Card
                              variant="outlined"
                              sx={{
                                height: "70%",
                                width: "90%",
                                backgroundColor: "#f7faf8",
                                borderColor: "#348139",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography 
                                variant="string" 
                                sx={{
                                  width: "98%",
                                  height: "80%",
                                  color: "#348139",
                                }}
                              >
                                {llamaRecom} 
                              </Typography>
                            </Card>
                          </Box>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Card>
          </Box>
        </Grid>

      </Grid>
  );
}
export default LookOut;
