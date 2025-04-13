import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: 'http://localhost:4002/graphql', // Business App GraphQL endpoint
  credentials: 'include'
});

// Add authentication to the request headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  };
});

// Create the Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)