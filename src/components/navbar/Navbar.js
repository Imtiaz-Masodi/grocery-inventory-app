import { Avatar, Container, Grid, Paper, Typography } from "@mui/material";
import { APP_NAME } from "../../utilities/constants";
import { NavLink } from "react-router-dom";
import './navbar.css';

const Navbar = () => {
    return (
        <Paper elevation={3} className="navbar-container">
            <Container>
                <Grid container alignItems="center">
                    <Grid item>
                        <NavLink to="/" style={{textDecoration: 'none'}}>
                            <Typography className="app-title"><span className="font-lobster">{APP_NAME}</span></Typography>
                        </NavLink>
                    </Grid>

                    <Grid item flexGrow={1} className="navbar-links">
                        <NavLink to="/update-inventory">Update Inventory</NavLink>
                        <NavLink to="/history">History</NavLink>
                    </Grid>

                    <Grid item className="cursor-pointer">
                        <a href="https://www.linkedin.com/in/mohd-imtiaz" alt="devloper-linkedin" target="_blank">
                            <Avatar alt="Remy Sharp" src="/assets/images/me.jpeg" />
                        </a>
                    </Grid>
                </Grid>
            </Container>
        </Paper>
    );
}
 
export default Navbar;