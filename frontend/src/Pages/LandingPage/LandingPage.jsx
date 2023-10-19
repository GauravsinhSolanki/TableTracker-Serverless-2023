import { Flex, Text, Button, VStack } from '@chakra-ui/react';
import React from 'react';
import { useMediaQuery } from 'react-responsive';

function LandingPage() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });

    return (
        <>
            {isMobile ? (
                <Flex w="100%" minHeight="90vh" backgroundColor="#000C89" flexDir="column" alignItems="center" justifyContent="start">
                    <Text color="white">This is the Landing Page</Text>
                </Flex>
            ) : (
                <Flex w="100%" minHeight="90vh" backgroundColor="#000C66" alignItems="center" justifyContent="space-evenly">
                    <Text color="white">This is the Landing Page</Text>
                </Flex>
            )}

            {/* Footer */}
            <Flex w="100%" backgroundColor="#000C44" alignItems="center" justifyContent="center" py={4}>
                <VStack spacing={4}>
                    <Button colorScheme="teal" variant="solid">
                        Subscribe
                    </Button>
                    <Text color="white" fontSize="sm">© 2023 Table Reservation App. All Rights Reserved.</Text>
                </VStack>
            </Flex>
        </>
    );
}

export default LandingPage;
