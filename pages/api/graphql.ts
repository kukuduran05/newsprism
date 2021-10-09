import { ApolloServer } from "apollo-server-micro";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "../../utils/api/typeDefs";
import { resolvers } from "../../utils/api/resolvers";
import { applyMiddleware } from "graphql-middleware";
import { log } from "../../utils/api/log";
import { context } from "../../utils/api/context";
import { permissions } from "../../utils/api/permissions";

const schema = applyMiddleware(makeExecutableSchema({typeDefs, resolvers}),
    log,
    permissions);

    
export const config = {
    api: {
        bodyParser: false
    }
};

const handler = new ApolloServer({
    schema,
    context
}).createHandler({
    path: '/api/graphql'
});

export default handler;
// const apolloServer = new ApolloServer(applyMiddleware(makeExecutableSchema({
//     typeDefs,
//     resolvers,
//     context
//   })), log);

// export default apolloServer.createHandler({ path: '/api/graphql' });