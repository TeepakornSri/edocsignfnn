import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useAuth } from '../hooks/use-auth';
import Swal from 'sweetalert2';
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoReload } from "react-icons/io5";

export default function SearchAppBar() {
    const { logout, authUser } = useAuth();
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

    const getTitleByPath = (path) => {
        if (path === '/upload') {
            return 'Upload Doc';
        } else if (path === '/userselect') {
            return 'User Select';
        } else if (path === '/view') {
            return 'View Doc';
        } else if (path.startsWith('/upload/update/')) {
            return 'Update Doc';
        } else if (path.startsWith('/upload/updateuserselect/')) {
            return 'Update UserSelect';
        } else {
            return 'HomePage';
        }
    };
    

    const handleLogout = async () => {
        await logout();
        Swal.fire({
            position: "center",
            icon: "success",
            title: "Log out",
            showConfirmButton: false,
            timer: 1500
        }).then(() => {
            window.location.href = '/';
        });
    };

    const handlereload = () => {
        window.location.href = '/';
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
                    <div className='flex flex-row justify-evenly  w-full'>
                        <Typography component="div" className='flex-1'>
                            <div className='flex flex-col gap-2 cursor-pointer'>
                                <Typography component="h1" variant="body1" className='text-white'>Sign in as</Typography>
                                {authUser ? (
                                    <Typography component="div" variant="body2" className='text-white text-xl font-semibold'>
                                        {`${authUser.firstName} - ${authUser.email}: ${authUser.department}`}
                                    </Typography>
                                ) : (
                                    <Typography component="div" variant="body2" className='text-white text-xl font-semibold'>
                                        Not logged in
                                    </Typography>
                                )}
                            </div>
                        </Typography>
                        <Typography component="div" className='flex justify-center items-center flex-1'>
                            <Link to='/homepage'>
                            <Typography component="h1" variant="h4" className='text-4xl font-semibold text-white cursor-pointer'>
                                {getTitleByPath(location.pathname)}
                            </Typography>
                            </Link>
                        </Typography>
                        <div className='flex flex-row justify-end items-center text-white flex-1'>
                            <div className='flex flex-row gap-6'>
                                <div className='text-6xl font-bold hover:text-orange-400 cursor-pointer' onClick={handlereload}><IoReload /></div>
                                
                                {location.pathname !== '/upload' && location.pathname !== '/userselect' && (
                                <Link to='/upload'>
                                    <div className='text-6xl font-bold hover:text-orange-400 cursor-pointer'>
                                        <IoIosAddCircleOutline />
                                    </div>
                                </Link>)}
                            </div>
                            <div className='ml-12'>
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
                                    {authUser && (
                                        <MenuItem onClick={handleLogout}>Log out</MenuItem>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </div>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
