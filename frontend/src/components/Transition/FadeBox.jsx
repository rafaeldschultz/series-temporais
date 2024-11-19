import { Box, Fade, Grow, Slide, Zoom } from "@mui/material";

const FadeBox = ({ children, ...props }) => {
  return (
    <Fade timeout={10} {...props} unmountOnExit mountOnEnter>
      <Box>{children}</Box>
    </Fade>
  );
};

export default FadeBox;
