import { Card, CardContent, CardMedia, Stack, Typography } from "@mui/material";

import DomainRoundedIcon from "@mui/icons-material/DomainRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

const ProfileCard = ({ user, sx }) => {
  return (
    <Card
      elevation={9}
      sx={(theme) => ({
        boxShadow: theme.palette.card.shadow,
        borderRadius: 2,
        width: "100%",
        maxWidth: 345,
        ...sx,
      })}
    >
      <CardMedia sx={{ height: 240 }} image={user.image} title={user.name} />
      <CardContent>
        <Stack spacing={1}>
          <Typography gutterBottom variant="h5" component="div">
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {user.area}
          </Typography>
          {user?.institute && (
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <DomainRoundedIcon color={"primary"} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user.institute}
              </Typography>
            </Stack>
          )}
          {user?.email && (
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <EmailRoundedIcon color={"primary"} />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user.email}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
