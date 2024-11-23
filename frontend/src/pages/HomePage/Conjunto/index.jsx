import { Typography } from "@mui/material";

const Conjunto = () => {
  return (
    <>
      <Typography variant="h3" gutterBottom sx={{color: '#2969BD', padding:'20px'}}>
        Sobre o Conjunto
      </Typography>
      
      <Typography align="justify" sx={{color: '#2969BD'}}>
        Os dados utilizados para esta análise foram obtidos diretamente do site OpendataSUS, o qual oferece acesso ao banco de dados de Síndrome Respiratória Aguda Grave (SRAG) em quatro arquivos distintos de 2021 a 2024. As bases incluem informações epidemiológicas relacionadas à Covid-19, bem como à vigilância da Influenza e de outros vírus respiratórios.
      </Typography>
    </>
  )
}
export default Conjunto;
