const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: "us-central-1",
});
const tableName = "restaurants";

exports.handler = async (event) => {
  try {
    const { restaurantId } = JSON.parse(event.body);

    const params = {
      TableName: tableName,
      Key: {
        restaurant_id: restaurantId,
      },
    };

    const data = await dynamodb.get(params).promise();

    if (!data || !data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Restaurant not found" }),
      };
    }

    const { name, address, latitude, longitude } = data.Item;

    return {
      statusCode: 200,
      body: JSON.stringify({
        name,
        address,
        location: {
          latitude,
          longitude,
        },
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
