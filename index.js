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
const cors = require('cors')

const setUpRemoteSchemas = async() => {
  const sublink = new HttpLink({ uri: 'http://127.0.0.1:4000/afi-subscribers', fetch });

  let schema = await introspectSchema(sublink);

  const subscriberSchema = makeRemoteExecutableSchema({
    schema,
    sublink,
  });

  const adlink = new HttpLink({ uri: 'http://130.239.222.39:3000/graphql', fetch });

  schema = await introspectSchema(adlink);

  const adsSchema = makeRemoteExecutableSchema({
    schema,
    adlink,
  });


  const executableSchema = mergeSchemas({
    schemas: [
      subscriberSchema,
      adsSchema,
    ],
  });

  // Initialize the app
  const app = express();

  // The GraphQL endpoint
  app.use('/graphql', bodyParser.json(), cors(), graphqlExpress({ schema: executableSchema }));

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
