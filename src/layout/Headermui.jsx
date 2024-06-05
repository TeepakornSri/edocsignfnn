import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../hooks/use-auth';
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';




export default function SearchAppBar() {
    const { logout, authUser } = useAuth();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);


    const handleLogout = () => {
        logout();

        if (authUser === null) {
            alert('Please Login');
        } else {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Log out",
                showConfirmButton: false,
                timer: 1500
            });
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="sticky ">
                <Toolbar>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        className='p-2 '

                    >
                        Sign in as
                        <br />
                        Name&Email&Department
                    </Typography>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                        className='p-4 '

                    >
                        Topic
                    </Typography>
                    <>
                        reload icon
                    </>
                    <>
                        +
                    </>

                    <div className='ml-12'>
                        {auth && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                >
                                    {authUser !== null && (
                                        <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                    )}
                                </Menu>
                            </div>

                        )}
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
