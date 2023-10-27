import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { NavLink } from 'react-router-dom';
import { theme } from '../../theme';

function logoutUser() {
    sessionStorage.clear();
}

function Navbar() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const user = sessionStorage.getItem("userDetails");

    return (
        isMobile ?
            <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor={theme.secondaryBackground}>
                <Text color="white">This is Navbar</Text>
            </Flex>
            :
            <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor={theme.secondaryBackground}>
                <Text color="white">This is Navbar</Text>
                {!user ? 
                    
                (<>
                    <Box>
                    <NavLink to='/user/login'>
                        <Text fontWeight="medium" color="white" fontSize="lg">Login</Text>
                    </NavLink>
                </Box>
                <Box>
                <NavLink to='/user/signup'>
                    <Text fontWeight="medium" color="white" fontSize="lg">Signup</Text>
                </NavLink>
                </Box>
                </>)
                :
               ( 
                <>
                <Box>
                    <NavLink to='/restaurantList'>
                        <Text fontWeight="medium" color="white" fontSize="lg">Restaurants</Text>
                    </NavLink>
                </Box>
                <Box>
                <NavLink to='/user/login' onClick={logoutUser}>
                    <Text fontWeight="medium" color="white" fontSize="lg">Logout</Text>
                </NavLink>
                </Box>
                </>)}
            </Flex>
    );
}

export default Navbar;