import { Box, Container, Stack, Typography, Button } from "@mui/material";

import mapaBrasil from "../../assets/mapa_brasil.png"
import { useState } from "react";

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

const Content = () => {
  const [selected, setSelected] = useState(1);

  const handleSubmit = (id) => {
    setSelected(id)
  };

  return (
    <Container maxWidth={false}  sx={{ height: '70vh' }}>
      <Box display={"flex"} justifyContent={"space-around"}
        alignItems={"center"} padding={"20px"}
      >
        <Box 
          display={"flex"} flexDirection={"column"}
          sx={{ bgcolor: '#ffffff', width:'40vw', height: '50vh', margin:"30px"}}
        >
          <Typography variant="h3" gutterBottom sx={{color: '#2969BD', padding:'20px'}}>
            SOBRE OS DADOS
          </Typography>
          <Stack spacing={2}>
            <Button variant={(selected == 1) ? "contained" : "outlined" } onClick={() => handleSubmit(1)}>Pré Visualização</Button>
            <Button variant={(selected == 2) ? "contained" : "outlined" } onClick={() => handleSubmit(2)}>Estatísticas Gerais</Button>
            <Button variant={(selected == 3) ? "contained" : "outlined" } onClick={() => handleSubmit(3)}>Análises Temporais</Button>
            <Button variant={(selected == 4) ? "contained" : "outlined" } onClick={() => handleSubmit(4)}>Sobre o Conjunto</Button>
          </Stack>
        </Box>
        <Box 
          display={"flex"} flexDirection={"column"}
          sx={{ bgcolor: '#cfe8fc', width:'40vw', borderRadius:'15px', height: '50vh', padding:'20px'}}
        >
          <Typography variant="h4" gutterBottom sx={{color: '#2969BD', padding:'20px'}}>
            AAA
          </Typography>
        </Box>
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
