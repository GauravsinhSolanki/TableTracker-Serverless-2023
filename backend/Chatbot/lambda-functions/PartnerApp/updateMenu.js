"use strict";
const Responses = require("../../../menu/lambdas/common/API_Responses");
const Dynamo = require("../../../menu/lambdas/Dynamo");

const tableName = process.env.menuTableName; // Ensure this environment variable is set in your Lambda function

exports.handler = async (event) => {
  try {
    // Extracting menu ID and updated availability from Lex slots
    const menuId = event.currentIntent.slots.MenuId;
    const updatedAvailability = event.currentIntent.slots.Availability; // This should be in a format that your DynamoDB table can accept

    if (!menuId || !updatedAvailability) {
      return Responses._400({
        message: "No menu ID or updated availability specified",
      });
    }

    const updatedVal = JSON.parse(updatedAvailability);

    const params = {
      TableName: tableName,
      Key: {
        id: menuId,
      },
      UpdateExpression: "SET #key = :updateKeyValue",
      ExpressionAttributeValues: {
        ":updateKeyValue": updatedVal,
      },
      ExpressionAttributeNames: {
        "#key": "items",
      },
    };

    await Dynamo.update(params);

    return Responses._200({ message: "Menu updated successfully" });
  } catch (error) {
    console.error(error);
    return Responses._400({ message: "Failed to update menu" });
  }
};
