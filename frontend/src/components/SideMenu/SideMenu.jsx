import {
  Box,
  Divider,
  Drawer,
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
    <Box
      sx={(theme) => ({
        width: "100%",
        maxWidth: 300,
        bgcolor: theme.palette.background,
        border: `1px solid ${theme.palette.disabled.main}`,
      })}
    >
      <List
        sx={{
          p: 2,
        }}
      >
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
              }}
              disablePadding
            >
              <ListItemButton
                alignItems="left"
                selected={
                  selectedItemId && navigationItem.id === selectedItemId
                }
                sx={(theme) => ({
                  borderRadius: 1,
                  "&.Mui-selected": {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: theme.palette.primary.light,
                  },
                })}
                onClick={
                  selectedItemId ? () => onSelect(navigationItem.id) : null
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
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SideMenu;
