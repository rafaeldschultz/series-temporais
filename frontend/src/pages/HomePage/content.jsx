import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useState } from "react";

import Analises from "./Analises";
import Conjunto from "./Conjunto";
import Estatisticas from "./Estatisticas";
import Preview from "./Preview";

const Information = (props) => {
  if (props.id == 1)  return <Preview />;
  if (props.id == 2)  return <Estatisticas />;
  if (props.id == 3)  return <Analises />;
  if (props.id == 4)  return <Conjunto />;
}



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
          sx={{ bgcolor: '#ffffff', width:'30vw', height: '50vh', margin:"30px"}}
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
          sx={{ bgcolor: '#cfe8fc', width:'50vw', borderRadius:'15px', height: '50vh', padding:'20px'}}
        >
          <Information id={selected} />

        </Box>
      </Box>
    </Container>
  );
};


export default Content