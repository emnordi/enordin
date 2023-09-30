import { Box, Container, Grid, Link, Theme, Typography } from "@mui/material";

interface Props {
  theme: Theme;
}

const Footer = ({ theme }: Props) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "inherit",
        paddingTop: "1rem",
        paddingBottom: "1rem",
        borderTop: "1px solid black",
      }}
    >
      <Container maxWidth="lg">
        <Grid container direction="column" alignItems="center">
          <Grid item xs={12}>
            <Link href="https://github.com/emnordi">GitHub</Link>
          </Grid>
          <Grid item xs={12}>
            <Typography color="textSecondary" variant="subtitle1">
              {`Emil ${new Date().getFullYear()}`}
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
