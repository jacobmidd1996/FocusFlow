import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import client from './ApolloClient'; // Import your Apollo Client setup
import LoginForm from './components/LoginForm'; // Example component, adjust as needed

const root = document.getElementById('root')!;

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <LoginForm /> {/* Replace with your main component when ready */}
    </ApolloProvider>
  </React.StrictMode>
);
