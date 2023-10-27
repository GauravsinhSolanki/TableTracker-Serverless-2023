import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, CircularProgress, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import { getRestaurants, getRestaurantsByID } from '../../../Services/RestaurantServices/RestaurantServices';
import { theme } from '../../../theme';
import { AuthCheck } from '../Authentication/AuthCheck';

function Restaurant() {
    const isMobile = useMediaQuery({ query: '(max-width: 1080px)' });
    const [restaurant, setRestaurant] = useState(null);
    const { restaurant_id } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRestaurantsByID(restaurant_id);
            setRestaurant(data);

        };
        fetchData();
    }, []);


    return (
        isMobile ?
            <Flex w="100%" minHeight="90vh" backgroundColor={theme.primaryBackground} flexDir="column" alignItems="center" justifyContent="start">
                <Text color="white">Restaurant List</Text>
            </Flex>
            :
            restaurant ?
                <Flex w="100%" backgroundColor={theme.primaryBackground} minHeight="90vh" flexDirection="column" alignItems="center">
                    <Flex w="90%" flexDirection="column" mt="24px" gap="16px" alignItems="center" >
                        <Text fontSize="2xl" fontWeight="semibold">{restaurant.restaurant_name}</Text>
                        <Text>Rating: {restaurant.google_rating}</Text>
                        <Text>Phone No: {restaurant.phone_no}</Text>
                        <Text>Address: {restaurant.address}</Text>
                        <Text>Opening Time: {restaurant.opening_time}</Text>
                        <Text>Closing Time: {restaurant.closing_time}</Text>
                    </Flex>
                </Flex>
                :
                <Flex w="100%" backgroundColor={theme.primaryBackground} minHeight="90vh" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default AuthCheck(Restaurant);