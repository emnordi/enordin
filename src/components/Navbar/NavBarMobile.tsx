import * as React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { Theme } from "@mui/material/styles";
import { Drawer, Link } from "@mui/material";

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

const NavBarMobile = ({ theme, colorMode, pages }: Props): JSX.Element => {
  const [open, setOpen] = React.useState(false);

  return (
    <Toolbar disableGutters>
      <Box sx={{ flexGrow: 1, display: "flex", gap: "40%" }}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={() => setOpen(true)}
          color="inherit"
        >
          <MenuIcon sx={{ transform: "scale(1.8)" }} />
        </IconButton>
        <Drawer
          anchor={"left"}
          open={open}
          onClose={() => setOpen(false)}
          disableScrollLock={true}
          PaperProps={{
            sx: { width: "20%" },
          }}
        >
          {pages.map((page) => (
            <MenuItem key={page.title}>
              <Link href={page.path} sx={{ textDecoration: "none", fontFamily: "Formula1Regular", fontSize: "2rem" }}>
                {page.title}
              </Link>
            </MenuItem>
          ))}
          <Box
            sx={{
              color: "text.primary",
            }}
          >
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Drawer>
        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            fontFamily: "Formula1Bold",
            fontWeight: 700,
            letterSpacing: ".3rem",
            color: "inherit",
            textDecoration: "none",
            padding: "1rem",
            fontSize: "2rem",
          }}
        >
          enordin
        </Typography>
      </Box>
    </Toolbar>
  );
};
export default NavBarMobile;
