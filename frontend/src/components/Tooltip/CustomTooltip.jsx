import { Box, Typography } from "@mui/material";

const CustomTooltip = ({ title }) => {
  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="body2" sx={{ lineHeight: 2 }}>
        {title}
      </Typography>
    </Box>
  );
};

export default CustomTooltip;
