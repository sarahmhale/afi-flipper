const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
import {
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema
} from 'graphql-tools';
import 'babel-polyfill';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

const setUpRemoteSchemas = async() => {
  const link = new HttpLink({ uri: 'http://127.0.0.1:4000/afi-subscribers', fetch });

  let schema = await introspectSchema(link);

  const subscriberSchema = makeRemoteExecutableSchema({
    schema,
    link,
  });

  // const link = new HttpLink({ uri: 'http://api.githunt.com/graphql', fetch });
  //
  // const schema = await introspectSchema(link);
  //
  // const executableSchema = makeRemoteExecutableSchema({
  //   schema,
  //   link,
  // });


  const executableSchema = mergeSchemas({
    schemas: [
      subscriberSchema,
    ],
  });

  // Initialize the app
  const app = express();

  // The GraphQL endpoint
  app.use('/graphql', bodyParser.json(), graphqlExpress({ schema: executableSchema }));

  // GraphiQL, a visual editor for queries
  app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
  // Start the server
  app.listen(3000, () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
  });

}

try {
    setUpRemoteSchemas();
} catch (e) {
    console.log(e, e.message, e.stack);
}
