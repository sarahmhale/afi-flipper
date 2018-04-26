import {
  makeRemoteExecutableSchema,
  mergeSchemas,
  introspectSchema
} from 'graphql-tools';
import 'babel-polyfill';
import { HttpLink } from 'apollo-link-http';
import fetch from 'node-fetch';

export const setUpRemoteSchemas = async() => {
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

}
