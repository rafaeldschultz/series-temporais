import { Box, Container, Stack, Typography, Button } from "@mui/material";

import mapaBrasil from "../../assets/mapa_brasil.png"
import { useState } from "react";

import Content from './content'

const Head = () => {
  const handleSubmit = () => {
    console.log("ok")
  };

  return (
    <Container maxWidth={false}  sx={{ bgcolor: '#2969BD', height: '70vh' }}>
      <Box display={"flex"} justifyContent={"space-around"}
        alignItems={"center"} padding={"20px"}
      >
        <Box display={"flex"} flexDirection={"column"}>
          <Typography variant="h3" gutterBottom sx={{color: 'white'}}>
            Análise Temporal
          </Typography>

          <Typography variant="h1" gutterBottom 
            sx={{ 
              fontSize: { xs: '1rem', sm: '2rem', md: '3.5rem' },
              fontWeight: 'bold', color: 'white'
            }}
          >
            Síndrome Respiratória Aguda
          </Typography>

          <Box>
            <Button
              size={"large"}
              color="primary"
              variant="contained"
              onClick={handleSubmit}
            >Acesse os Dados</Button>
          </Box>

        </Box>
        <img src={mapaBrasil} alt="Example" style={{ width: '40%', height: 'auto' }} />
      </Box>
    </Container>
  );
};



const Foot = () => {
  return (
    <Container maxWidth={false}  sx={{ bgcolor: '#2969BD', height: '20vh' }} />
  );
};


const HomePage = () => {
  return (
    <>
      <Head/>
      <Content/>
      <Foot/>
    </>
  )
}
export default HomePage;
