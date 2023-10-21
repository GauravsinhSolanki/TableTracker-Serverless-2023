import { Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

function LandingPage() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" flexDir="column" alignItems="center" justifyContent="start">
                <Text color="white">This is the Landing Page</Text>
            </Flex>
            :
            <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" alignItems="center" justifyContent="space-evenly">
                <Text color="white">This is the Landing Page</Text>
            </Flex>
    );
}

export default LandingPage;