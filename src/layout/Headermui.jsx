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
import ReplayIcon from '@mui/icons-material/Replay';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoReload } from "react-icons/io5";




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
            <AppBar position="sticky">
                <Toolbar>
                    <div className='flex flex-row  justify-evenly w-full '>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            className='p-2 '

                        >
                            <div className='flex flex-col gap-2'>
                                <h1 className=' text-white'>Sign in as</h1>
                                <div className='text-white text-xl font-semibold'>
                                    {`${authUser.firstName} - ${authUser.email}: ${authUser.department}`}
                                </div>
                            </div>
                        </Typography>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            className='p-4 '

                        >
                            <h1 className='text-4xl font-semibold text-white'>Upload Doc</h1>
                        </Typography>
                        <div className='flex flex-row justify-center items-center text-white'>
                            <div className='flex flex-row gap-6'>
                                <div className='text-6xl font-bold hover:text-orange-400 cursor-pointer'><IoReload /></div>
                                <div className='text-6xl font-bold hover:text-orange-400 cursor-pointer'><IoIosAddCircleOutline /></div>
                            </div>


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
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
