import { Box, Stack, Typography } from "@mui/material";

import FunctionsIcon from '@mui/icons-material/Functions';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { useState } from "react";


const Estatisticas = () => {
  return (
    <>
      <Stack>
        <Typography variant="h3" gutterBottom sx={{color: '#215497', padding:'20px'}}>
          Estatísticas Gerais
        </Typography>

        <Box display={"flex"} alignContent={"center"} justifyContent={"space-around"}>

        <Stack alignItems={"center"}>
            <FunctionsIcon  sx={{ color: '#215497', width:"100px", height:"100px" }}/>
            <Typography variant="h4" gutterBottom>
              2.758.557 Casos
            </Typography>
          </Stack>

          <Stack alignItems={"center"}>
            <CalendarTodayIcon  sx={{ color: '#215497', width:"100px", height:"100px" }}/>
            <Typography variant="h4" gutterBottom>
              4 Anos
            </Typography>
          </Stack>

          <Stack alignItems={"center"}>
            <MapOutlinedIcon  sx={{ color: '#215497', width:"100px", height:"100px" }}/>
            <Typography variant="h4" gutterBottom>
              3124 Localidades
            </Typography>
          </Stack>

        </Box>
      </Stack>
    </>
  )
}
export default Estatisticas;
