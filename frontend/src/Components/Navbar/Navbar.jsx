import { Flex, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';


function Navbar() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        isMobile ?
            <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor="#050A30">
                <Text color="white">This is Navbar</Text>
            </Flex>
            :
            <Flex as="nav" alignItems="center" justify="space-between" h="10vh" w="100%" backgroundColor="#050A30">
                <Text color="white">This is Navbar</Text>
            </Flex>
    );
}

export default Navbar;