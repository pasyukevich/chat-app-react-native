import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import ChatScreen from './src/screens/ChatScreen';
import { DefaultTheme } from 'react-native-paper';
import { loadErrorMessages, loadDevMessages } from "@apollo/client/dev";
import { ApolloProvider } from '@apollo/client';
import apolloClient from './AppoloClient';

if (__DEV__) {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

export default function App() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#6200ee',
      accent: '#03dac4',
    },
  };

  return (
    <ApolloProvider client={apolloClient}>
      <PaperProvider theme={theme}>
        <ChatScreen />
      </PaperProvider>
    </ApolloProvider>
  );
}
