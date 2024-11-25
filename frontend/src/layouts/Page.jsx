import { Paper, Toolbar } from "@mui/material";

const Page = ({ children, sx, ...others }) => {
  return (
    <Paper
      sx={(theme) => ({
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        border: "none",
        borderRadius: 0,
        height: "100%",
        ...sx,
      })}
      {...others}
    >
      {children}
    </Paper>
  );
};

export default Page;
