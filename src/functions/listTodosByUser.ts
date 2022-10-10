import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "src/utils/dynamodbClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;

  if (user_id) {
    const response = await document
      .query({
        TableName: "user_todos",
        KeyConditionExpression: "user_id = :id",
        ExpressionAttributeValues: {
          ":id": user_id,
        },
        IndexName: "user_id_index",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify(response.Items),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "usuário não encontrado, digite um user_id válido",
    }),
  };
};
