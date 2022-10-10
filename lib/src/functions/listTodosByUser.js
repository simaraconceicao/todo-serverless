import { document } from 'src/utils/dynamodbClient';
export const handler = async (event) => {
    const { user_id } = event.pathParameters;
    const response = await document.query({
        TableName: 'user_todos',
        KeyConditionExpression: 'id = :user_id',
        ExpressionAttributeValues: {
            ':user_id': user_id
        }
    }).promise();
    console.log('response', response);
    console.log('parei aqui');
    const userTodos = response.Items[0];
    console.log(userTodos.title);
    return {
        statusCode: 200,
        body: JSON.stringify({
            todos: [
                {
                    id: userTodos.id,
                    user_id: userTodos.user_id,
                    title: userTodos.title,
                    done: userTodos.done,
                    deadline: userTodos.deadline
                }
            ]
        })
    };
};
//# sourceMappingURL=listTodosByUser.js.map