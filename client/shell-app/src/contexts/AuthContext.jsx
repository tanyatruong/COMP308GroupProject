import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApolloClient, InMemoryCache, gql, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create Apollo Client
const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4000/graphql',
  credentials: 'include'
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include'
});

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const ME_QUERY = gql`
  query Me {
    me {
      ... on Resident {
        id
        username
        role
      }
      ... on BusinessOwner {
        id
        username
        role
      }
      ... on CommunityOrganizer {
        id
        username
        role
      }
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      const { data } = await client.query({
        query: ME_QUERY,
        fetchPolicy: 'network-only'
      });
      
      console.log('Me query response:', data);
      
      if (data.me) {
        setUser(data.me);
        console.log('User authenticated:', data.me);
      } else {
        setUser(null);
        console.log('No user authenticated');
      }
    } catch (error) {
      console.log('Auth check failed:', error.message);
      console.log('Error details:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await client.mutate({
        mutation: gql`
          mutation Logout {
            logout
          }
        `
      });
    } catch (error) {
      console.log('Logout error:', error.message);
    } finally {
      setUser(null);
      // Clear any local storage
      localStorage.clear();
      sessionStorage.clear();
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    checkAuth,
    logout,
    client
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { client };
