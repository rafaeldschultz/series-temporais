import { Stack, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import ProfileCard from "../../components/Cards/ProfileCard";
import Page from "../../layouts/Page";

const users = [
  {
    name: "Rafael Schultz",
    area: "Engenharia de Computação",
    institute: "EESC, ICMC",
    image: "https://avatars.githubusercontent.com/u/67744535?v=4",
  },
  {
    name: "Rafael Souza",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/89589108?v=4",
  },
  {
    name: "Thiago Ambiel",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image:
      "https://www.upwork.com/profile-portraits/c1zBWBraHRX1X79D5OUEzOCgOdpUyKxZx9d1He3vqv_ORwVc3fvJBQt7pvblxFSpkA",
  },
  {
    name: "Murillo Yumoto",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/105159090?v=4",
  },
  {
    name: "Arthur Rezende",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/109704516?v=4",
  },
  {
    name: "Camila Sayaka",
    email: "",
    area: "Estatística e Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/95271539?v=4",
  },
  {
    name: "Ciro Falsarella",
    email: "",
    area: "Ciência da Computação",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/61745490?v=4",
  },
  {
    name: "Lua Quito",
    email: "",
    area: "Estatística e Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/15474343?v=4",
  },
  {
    name: "Lucas Melo",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/97560175?v=4",
  },
  {
    name: "Lucca Ferraz",
    email: "",
    area: "Ciência de Dados",
    institute: "ICMC",
    image: "https://avatars.githubusercontent.com/u/103869083?v=4",
  },
].sort((a, b) => a.name.localeCompare(b.name));

const AboutUsPage = () => {
  return (
    <Page>
      <Stack width={1} height={1} alignItems={"center"} mt={10} spacing={2}>
        <Typography
          variant={"h1"}
          sx={(theme) => ({ color: theme.palette.primary.dark })}
        >
          CONHEÇA O NOSSO GRUPO
        </Typography>
        <Typography
          variant="h6"
          sx={(theme) => ({ color: theme.palette.secondary.main })}
          align="center"
        >
          Este projeto foi desenvolvivo como parte da disciplina SME0808 -
          Séries Temporais e<br />
          Aprendizado Dinâmico por alunos da Universidade de São Paulo (USP).
        </Typography>
        <Grid container width={0.7} pt={5} spacing={4} pb={10}>
          {users.slice(0, 8).map((user) => (
            <Grid size={3}>
              <ProfileCard key={user.email} user={user} />
            </Grid>
          ))}
          <Grid size={3}></Grid>
          {users.slice(8, 10).map((user) => (
            <Grid size={3}>
              <ProfileCard key={user.email} user={user} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    </Page>
  );
};

export default AboutUsPage;
