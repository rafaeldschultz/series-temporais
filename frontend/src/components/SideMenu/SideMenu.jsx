import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  styled,
  Tooltip,
  useTheme,
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import { memo, useMemo, useState } from "react";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: 90,
  [theme.breakpoints.up("sm")]: {
    width: 90,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const SideMenu = memo(
  ({
    navigationItems,
    onSelect,
    selectedItemId,
    basePath = "",
    depth = 0,
    onLinkClick,
    isMini = false,
    isFullyExpanded = true,
    hasDrawerTransitions = false,
  }) => {
    const [open, setopen] = useState(true);

    const toggleDrawer = () => {
      setopen(!open);
    };

    return (
      <Drawer open={open} variant="permanent">
        <Stack sx={{ flexGrow: 1, p: 2, pt: 12 }}>
          <Box display={"flex"} justifyContent={open ? "flex-end" : "center"}>
            <IconButton onClick={toggleDrawer}>
              {open ? <ChevronLeftRoundedIcon /> : <ChevronRightRoundedIcon />}
            </IconButton>
          </Box>
          <Divider
            sx={{
              borderBottomWidth: 2,
              mx: 1,
              mt: 1,
            }}
          />
          <List>
            {navigationItems.map((navigationItem, navigationItemIndex) => {
              if (navigationItem.kind === "header") {
                return (
                  <Box key={`subheader-${depth}-${navigationItemIndex}`}>
                    {open && (
                      <ListSubheader
                        component="div"
                        sx={(theme) => ({
                          fontSize: 12,
                          fontWeight: "700",
                          height: 40,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          zIndex: 2,
                          backgroundColor: theme.palette.background.paper,
                        })}
                      >
                        {navigationItem.title}
                      </ListSubheader>
                    )}
                  </Box>
                );
              }

              if (navigationItem.kind === "divider") {
                const nextItem = navigationItems[navigationItemIndex + 1];

                return (
                  <Divider
                    key={`divider-${depth}-${navigationItemIndex}`}
                    sx={{
                      borderBottomWidth: 2,
                      mx: 1,
                      mt: 1,
                      mb: nextItem?.kind === "header" && !isMini ? 0 : 1,
                      ...(hasDrawerTransitions
                        ? getDrawerSxTransitionMixin(isFullyExpanded, "margin")
                        : {}),
                    }}
                  />
                );
              }

              return (
                <Tooltip
                  title={navigationItem.title}
                  placement="right"
                  arrow
                  key={navigationItemIndex}
                >
                  <ListItem
                    sx={{
                      overflowX: "hidden",
                      my: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    disablePadding
                  >
                    <ListItemButton
                      alignItems="center"
                      selected={
                        selectedItemId != null &&
                        navigationItem.id === selectedItemId
                      }
                      sx={[
                        (theme) => ({
                          borderRadius: 1,
                          "&.Mui-selected": {
                            backgroundColor: theme.palette.primary.dark,
                            color: theme.palette.primary.contrastText,
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: theme.palette.primary.light,
                          },
                          alignItems: "center",
                        }),
                        open
                          ? {
                              justifyContent: "initial",
                            }
                          : {
                              justifyContent: "center",
                            },
                      ]}
                      onClick={
                        selectedItemId != null
                          ? () => onSelect(navigationItem.id)
                          : null
                      }
                    >
                      <ListItemIcon
                        sx={[
                          {
                            color: "inherit",
                            "& svg": {
                              color: "inherit",
                            },
                            minWidth: 0,
                            justifyContent: "center",
                            alignItems: "center",
                          },
                          open
                            ? {
                                mr: 3,
                              }
                            : {
                                mr: "auto",
                              },
                        ]}
                      >
                        {navigationItem.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={navigationItem.title}
                        sx={[
                          {
                            whiteSpace: "nowrap",
                            zIndex: 1,
                            "& .MuiTypography-root": {
                              fontWeight: "500",
                            },
                          },
                          open
                            ? {
                                opacity: 1,
                              }
                            : {
                                opacity: 0,
                              },
                        ]}
                        align="left"
                        primaryTypographyProps={{
                          variant: "body2",
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Tooltip>
              );
            })}
          </List>
        </Stack>
      </Drawer>
    );
  }
);

export default SideMenu;
