import React, { useState } from "react";
import { alpha, Chip, Menu, MenuItem, styled } from "@mui/material";
import Grid from "@mui/material/Grid2";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.text.primary,
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
    ...theme.applyStyles("dark", {
      color: theme.palette.grey[300],
    }),
  },
}));

const ChipHorizontalGrid = ({ items }) => {
  const [anchorEls, setAnchorEls] = useState(Array(items.length).fill(null));
  const [openStates, setOpenStates] = useState(Array(items.length).fill(false));

  const handleClick = (index, event) => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);

    const newOpenStates = [...openStates];
    newOpenStates[index] = true;
    setOpenStates(newOpenStates);
  };

  const handleClose = (index) => {
    const newOpenStates = [...openStates];
    newOpenStates[index] = false;
    setOpenStates(newOpenStates);
  };

  const handleSelection = (item, value) => {
    item.onChange(value);
    handleClose();
  };

  return (
    <Grid container spacing={1}>
      {items.map((item, index) => (
        <Grid item key={item.label}>
          <Chip
            label={
              item.label +
              ": " +
              item.values.find(({ value }) => value === item.currentValue).label
            }
            size="small"
            color="secondary"
            variant="filled"
            onClick={(event) => handleClick(index, event)}
          />
          <StyledMenu
            anchorEl={anchorEls[index]}
            open={openStates[index]}
            onClose={() => handleClose(index)}
          >
            {item.values.map(({ value, label }) => (
              <MenuItem
                key={value}
                onClick={() => handleSelection(item, value)}
                width={1}
              >
                {label}
              </MenuItem>
            ))}
          </StyledMenu>
        </Grid>
      ))}
    </Grid>
  );
};

export default ChipHorizontalGrid;
