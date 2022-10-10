const serverlessConfiguration = {
    service: 'desafio-serverless',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild', 'serverless-dynamodb-local', 'serverless-offline'],
    provider: {
        name: 'aws',
        runtime: 'nodejs14.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        lambdaHashingVersion: "20201221",
        iamRoleStatements: [
            {
                Effect: "Allow",
                Action: ["dynamodb:*"],
                Resource: ["*"]
            }
        ]
    },
    functions: {
        createTodo: {
            handler: 'src/functions/createTodo.handler',
            events: [
                {
                    http: {
                        path: 'createTodo/{user_id}',
                        method: 'post',
                        cors: true
                    }
                }
            ]
        },
        listTodosByUser: {
            handler: 'src/functions/listTodosByUser.handler',
            events: [
                {
                    http: {
                        path: 'listTodosByUser/{user_id}',
                        method: 'get',
                        cors: true
                    }
                }
            ]
        }
    },
    package: { individually: true },
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node14',
            define: { 'require.resolve': undefined },
            platform: 'node',
            concurrency: 10,
        },
        dynamodb: {
            stages: ['dev', 'local'],
            start: {
                port: 8000,
                inMemory: true,
                migrate: true
            }
        },
    },
    resources: {
        Resources: {
            dbCertificateUsers: {
                Type: "AWS::DynamoDB::Table",
                Properties: {
                    TableName: "user_todos",
                    ProvisionedThroughput: {
                        ReadCapacityUnits: 5,
                        WriteCapacityUnits: 5
                    },
                    AttributeDefinitions: [
                        {
                            AttributeName: "id",
                            AttributeType: "S"
                        }
                    ],
                    KeySchema: [
                        {
                            AttributeName: "id",
                            KeyType: "HASH"
                        }
                    ]
                }
            }
        }
    }
};
module.exports = serverlessConfiguration;
export {};
//# sourceMappingURL=serverless.js.map