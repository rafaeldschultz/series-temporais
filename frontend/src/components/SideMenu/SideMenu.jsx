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
} from "@mui/material";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";

const SideMenu = ({
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
  return (
    <MuiDrawer
      variant="permanent"
      sx={(theme) => ({
        width: 240,
        flexShrink: 0,
        whiteSpace: "nowrap",
        display: { xs: "none", md: "block" },
        [`& .${drawerClasses.paper}`]: {
          width: 240,
          boxSizing: "border-box",
        },
        ...(hasDrawerTransitions
          ? getDrawerSxTransitionMixin(isFullyExpanded, "width")
          : {}),
      })}
    >
      <Stack
        sx={{ flexGrow: 1, p: 2, pt: 12, justifyContent: "space-between" }}
      >
        <List>
          {navigationItems.map((navigationItem, navigationItemIndex) => {
            if (navigationItem.kind === "header") {
              return (
                <ListSubheader
                  key={`subheader-${depth}-${navigationItemIndex}`}
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
              <ListItem
                key={navigationItemIndex}
                sx={{
                  overflowX: "hidden",
                  my: 1,
                  display: "block",
                }}
                disablePadding
              >
                <ListItemButton
                  alignItems="left"
                  selected={
                    selectedItemId != null &&
                    navigationItem.id === selectedItemId
                  }
                  sx={(theme) => ({
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.dark,
                      color: theme.palette.primary.contrastText,
                    },
                    "&.Mui-selected:hover": {
                      backgroundColor: theme.palette.primary.light,
                    },
                  })}
                  onClick={
                    selectedItemId != null
                      ? () => onSelect(navigationItem.id)
                      : null
                  }
                >
                  <ListItemText
                    primary={navigationItem.title}
                    sx={{
                      whiteSpace: "nowrap",
                      zIndex: 1,
                      "& .MuiTypography-root": {
                        fontWeight: "500",
                      },
                    }}
                    align="left"
                    primaryTypographyProps={{
                      variant: "body2",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </MuiDrawer>
  );
};

export default SideMenu;
