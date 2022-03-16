import React from 'react';
import ReactDOM from 'react-dom';
// eslint-disable-next-line object-curly-newline
import { ApolloClient, InMemoryCache, HttpLink, ApolloProvider } from '@apollo/client';
import { App } from './App';

const httpLink = new HttpLink({
  uri: 'https://react-assessment.herokuapp.com/graphql',
});

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
