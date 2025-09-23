import { BrowserRouter as Router } from "react-router-dom";
import { ApolloProvider } from '@apollo/client';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { AuthProvider, client } from './contexts/AuthContext';
import AuthenticatedApp from './components/AuthenticatedApp';

function App() {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Router>
          <AuthenticatedApp />
        </Router>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
