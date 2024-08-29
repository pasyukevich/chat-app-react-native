import React, { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text, Appbar } from 'react-native-paper';
import { useQuery, useMutation, useSubscription, gql } from '@apollo/client';
import { SafeAreaView } from 'react-native-safe-area-context';

const GET_MESSAGES = gql`
  query {
    messages {
      id
      text
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
    }
  }
`;

const MESSAGE_SENT_SUBSCRIPTION = gql`
  subscription messageSent {
    messageSent {
      id
      text
    }
  }
`;

const ChatScreen = () => {
  const { loading, error, data } = useQuery(GET_MESSAGES);
  const [sendMessage] = useMutation(SEND_MESSAGE);
  const { data: subscriptionData } = useSubscription(MESSAGE_SENT_SUBSCRIPTION);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data) {
      setMessages(data.messages);
    }
  }, [data]);

  useEffect(() => {
    if (subscriptionData) {
      setMessages((prevMessages) => [...prevMessages, subscriptionData.messageSent]);
    }
  }, [subscriptionData]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading messages</Text>;

  const handleSendMessage = async () => {
    if (message) {
      await sendMessage({ variables: { text: message } });
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Chat App" />
      </Appbar.Header>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text>{item.text}</Text>
            </Card.Content>
          </Card>
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message"
          mode="outlined"
        />
        <Button mode="contained" onPress={handleSendMessage} style={styles.button}>
          Send
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    marginRight: 8,
  },
  button: {
    height: 56,
    justifyContent: 'center',
  },
});

export default ChatScreen;
