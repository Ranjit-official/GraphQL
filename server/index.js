const express = require("express");
const { ApolloServer } = require("@apollo/server")
const cors = require("cors");
const bodyParser = require("body-parser");
const { expressMiddleware } = require("@as-integrations/express5")
const axios = require("axios");

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `
        type User{
        id : ID!
        name : String!
        username : String!
        email : String!
        phone : String!
        website : String!
        }
        
        
        type Todo {
        id: ID!
        title: String!
        completed: Boolean
        user: User
        }
        
        type Query {
        getTodos: [Todo]
        getAllUsers : [User]
        getUserById(id: ID!) : User
        }
        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    return (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`)).data
                }
            },
            Query: {
                getTodos: async () =>
                    (await axios.get("https://jsonplaceholder.typicode.com/todos")).data


                ,

                getAllUsers: async () => (await axios.get("https://jsonplaceholder.typicode.com/users")).data,
                getUserById: async (parent, { id }) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`)).data

            }
        },


    });

    app.use(cors());
    app.use(bodyParser.json());

    await server.start();

    app.use('/graphql', expressMiddleware(server))

    app.listen(8000, () => { console.log("Server Started;") })
}

startServer();

