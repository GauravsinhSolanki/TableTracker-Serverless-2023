export const getRestaurants = async () => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return null;
    }
}

export const getRestaurantsByID = async (restaurant_id) => {
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(`https://jrcigezb1g.execute-api.us-east-1.amazonaws.com/restaurants/${restaurant_id}`, options);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching restaurants by :', error);
        return null;
    }
}