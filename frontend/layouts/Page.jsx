import { Paper, Toolbar } from "@mui/material";

const Page = ({ children, sx, ...others }) => {
  return (
    <Paper
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        height: 1,
        overflowY: "auto",
        border: "none",
        borderRadius: 0,
        padding: 4,
        ...sx,
      }}
      {...others}
    >
      {children}
    </Paper>
  );
};

export default Page;
