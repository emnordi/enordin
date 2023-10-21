import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Theme } from "@mui/material/styles";

interface Props {
  theme: Theme;
  colorMode: {
    toggleColorMode: () => void;
  };
  pages: {
    title: string;
    path: string;
  }[];
}

const NavBarDesktop = ({ theme, colorMode, pages }: Props): JSX.Element => {
  const pathName = window.location.pathname;

  return (
    <Toolbar disableGutters>
      <Box
        sx={{
          mr: 2,
          display: "flex",
          height: "50px",
          width: "50px",
        }}
      >
        <img src="assets/logo.svg"></img>
      </Box>
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: "flex",
          fontFamily: "Formula1Bold",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "inherit",
          textDecoration: "none",
          padding: "1rem",
        }}
      >
        enordin
      </Typography>
      <Box
        sx={{
          mr: 2,
          display: { xs: "flex", md: "none" },
          flexGrow: 1,
          height: "50px",
          width: "50px",
        }}
      >
        <img src="assets/logo.svg"></img>
      </Box>
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {pages.map((page) => (
          <Button
            key={page.title}
            sx={{
              my: 2,
              color: pathName === page.path ? theme.palette.error.main : "white",
              display: "block",
              fontFamily: "Formula1Regular",
            }}
            href={page.path}
          >
            {page.title}
          </Button>
        ))}
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "8%",
          alignItems: "center",
          justifyContent: "center",
          color: "text.primary",
          borderRadius: 1,
        }}
      >
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    </Toolbar>
  );
};
export default NavBarDesktop;
