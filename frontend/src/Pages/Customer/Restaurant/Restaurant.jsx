import { Button, CircularProgress, Flex, Heading, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useParams } from 'react-router-dom';
import { getRestaurantsByID } from '../../../Services/RestaurantServices/RestaurantServices';
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
                        <Button borderColor={theme.secondaryForeground} bgColor={theme.accent}>Book</Button>
                        <Heading fontSize="3xl" fontWeight="medium" color={theme.primaryForeground} mt="24px">MENU</Heading>
                        <Heading fontSize="2xl" fontWeight="medium" color={theme.primaryForeground} mt="24px">Starter</Heading>
                        <Flex w="90%" flexDirection="column" mt="24px" gap="16px" alignItems="center" >
                            {
                                restaurant.menu.starter?.map((menuItem, ind) => {
                                    return <Text> {menuItem}</Text>
                                })
                            }
                        </Flex>
                        <Heading fontSize="2xl" fontWeight="medium" color={theme.primaryForeground} mt="24px">Main course</Heading>
                        <Flex w="90%" flexDirection="column" mt="24px" gap="16px" alignItems="center" >
                            {
                                restaurant.menu.main_course?.map((menuItem, ind) => {
                                    return <Text> {menuItem}</Text>
                                })
                            }
                        </Flex>
                        <Heading fontSize="2xl" fontWeight="medium" color={theme.primaryForeground} mt="24px">Desert</Heading>
                        <Flex w="90%" flexDirection="column" mt="24px" gap="16px" alignItems="center" >
                            {
                                restaurant.menu.desert?.map((menuItem, ind) => {
                                    return <Text> {menuItem}</Text>
                                })
                            }
                        </Flex>

                    </Flex>
                </Flex>
                :
                <Flex w="100%" backgroundColor={theme.primaryBackground} minHeight="90vh" flexDirection="column" alignItems="center" justifyContent="center">
                    <CircularProgress isIndeterminate color="teal" />
                </Flex>
    );
}

export default AuthCheck(Restaurant);