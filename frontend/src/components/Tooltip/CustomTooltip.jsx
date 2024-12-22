import { Box, Typography } from "@mui/material";
import React from "react";

const CustomTooltip = ({ title }) => {
  return (
    <Box sx={{ p: 1 }}>
      {React.isValidElement(title) ? (
        // Render the React component as is
        title
      ) : (
        // Render the title as text inside Typography
        <Typography variant="body2" sx={{ lineHeight: 2 }} fontWeight={"bold"}>
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default CustomTooltip;
