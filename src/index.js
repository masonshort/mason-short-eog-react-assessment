import React from 'react';
import ReactDOM from 'react-dom';
// import fetch from 'cross-fetch';
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
// import { getMainDefinition } from '@apollo/client/utilities';
// import { createClient } from 'graphql-ws';
import { App } from './App';

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: 'https://react.eogresources.com/graphql',
//   }),
// );

const httpLink = new HttpLink({
  uri: 'https://react.eogresources.com/graphql',
});

// const splitLink = split(
//   ({ query }) => {
//     const definition = getMainDefinition(query);
//     return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
//   },
//   wsLink,
//   httpLink,
// );

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
);
