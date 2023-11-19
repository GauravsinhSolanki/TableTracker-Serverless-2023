import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
    DynamoDBDocumentClient,
    ScanCommand,
    PutCommand,
    GetCommand,
    DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { uuid } from "uuidv4";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "restaurants";

export const handler = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
        "Content-Type": "application/json",
    };

    try {
        switch (event.routeKey) {
            case "DELETE /restaurants/{restaurant_id}":
                await dynamo.send(
                    new DeleteCommand({
                        TableName: tableName,
                        Key: {
                            restaurant_id: event.pathParameters.restaurant_id,
                        },
                    })
                );
                body = { restaurant_id: event.pathParameters.restaurant_id };
                break;
            case "GET /restaurants/{restaurant_id}":
                body = await dynamo.send(
                    new GetCommand({
                        TableName: tableName,
                        Key: {
                            restaurant_id: event.pathParameters.restaurant_id,
                        },
                    })
                );
                body = body.Item;
                break;
            case "GET /restaurants":
                body = await dynamo.send(
                    new ScanCommand({ TableName: tableName })
                );
                body = body.Items;
                break;
            case "PUT /restaurants":
                let requestJSON = JSON.parse(event.body);
                let ruuid = requestJSON.restaurant_id ?? uuid();
                let muuid = requestJSON.menu_id ?? uuid();
                await dynamo.send(
                    new PutCommand({
                        TableName: tableName,
                        Item: {
                            restaurant_id: ruuid,
                            address: requestJSON.address,
                            closing_time: requestJSON.closing_time,
                            google_rating: requestJSON.google_rating,
                            image: requestJSON.image,
                            instagram: requestJSON.instagram,
                            menu: {
                                menu_id: muuid,
                                starter: requestJSON.menu.starter,
                                main_course: requestJSON.menu.main_course,
                                desert: requestJSON.menu.desert,
                                drinks: requestJSON.menu.drinks
                            },
                            opening_time: requestJSON.opening_time,
                            phone_no: requestJSON.phone_no,
                            restaurant_name: requestJSON.restaurant_name,
                            twitter: requestJSON.twitter,
                            availability: requestJSON.availability,
                            max_tables: requestJSON.max_tables,
                            reviews: requestJSON.reviews
                        },
                    })
                );
                body = { restaurant_id: ruuid };
                break;
            default:
                throw new Error(`Unsupported route: "${event.routeKey}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};
