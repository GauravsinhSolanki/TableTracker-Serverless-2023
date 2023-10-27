import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, CircularProgress, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { getRestaurants } from '../../../Services/RestaurantServices/RestaurantServices';
import { theme } from '../../../theme';
import { AuthCheck} from '../Authentication/AuthCheck'

function RestaurantList() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const [restaurants, setRestaurants] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRestaurants();
            setRestaurants(data);

        };
        fetchData();
    }, []);


    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                <Text color="white">Restaurant List</Text>
            </Flex>
            :
            restaurants ?
                <Flex w="100%" backgroundColor={theme.primaryBackground} minHeight="90vh" flexDirection="column" alignItems="center">
                    <Heading fontSize="2xl" fontWeight="medium" color={theme.primaryForeground} mt="24px">Restaurant List</Heading>
                    <Flex w="90%" flexDirection="column" mt="24px" gap="16px" alignItems="center" >
                        {
                            restaurants?.map((restaurant, ind) => {
                                return <button onClick={() => navigate(`${restaurant.restaurant_id}`)}>
                                    <Flex flexDirection="column" border="2px" width="720px" borderColor={theme.secondaryForeground} bgColor={theme.accent} borderRadius="8px" padding="24px">
                                        <Text fontSize="2xl" fontWeight="semibold">{restaurant.restaurant_name}</Text>
                                        <Text>Rating {restaurant.google_rating}</Text>
                                    </Flex>
                                </button>
                            })
                        }
                    </Flex>
                </Flex>
                :
                <Flex w="100%" backgroundColor={theme.primaryBackground} minHeight="90vh" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default AuthCheck(RestaurantList);