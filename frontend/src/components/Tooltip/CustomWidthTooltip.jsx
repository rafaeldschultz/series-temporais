import { styled } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 300,
    fontSize: theme.typography.pxToRem(12),
    backgroundColor: theme.palette.secondary.dark,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.primary.main,
    "&:before": {
      backgroundColor: theme.palette.secondary.dark,
    },
  },
}));

export default CustomWidthTooltip;
