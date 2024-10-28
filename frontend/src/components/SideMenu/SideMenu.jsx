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
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const navigationItems = [
  {
    kind: "header",
    segment: "",
    title: "Espacial",
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: true,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "divider",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "header",
    segment: "",
    title: "Temporal",
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
  {
    kind: "item",
    segment: "",
    title: "Home",
    icon: <HomeRoundedIcon />,
    pattern: "",
    action: "",
    children: [],
    isSelected: false,
  },
];

const SideMenu = ({
  basePath = "",
  depth = 0,
  onLinkClick,
  isMini = false,
  isFullyExpanded = true,
  hasDrawerTransitions = false,
  selectedItemId,
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
                selected={navigationItem.isSelected}
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
