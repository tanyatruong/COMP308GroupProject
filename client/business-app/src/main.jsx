import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Link to the Apollo Gateway
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Apollo Gateway endpoint
  credentials: 'include'
});

// Add authentication to the request headers
const authLink = setContext((_, { headers }) => {
  // Get any authentication tokens from localStorage (just in case it's needed)
  const token = localStorage.getItem('authToken');
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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