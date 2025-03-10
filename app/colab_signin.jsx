import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Query, Account, Databases, Client } from 'appwrite';
import { profile_page } from '../app/colab_Profile1'; // Assuming this function navigates to the profile page
import {Sign_up} from '../app/colab_signup';


const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
  .setProject('67cda0b40018d09b93a6');  // Your Appwrite Project ID

// Initialize the Account service
const account = new Account(client);

// Initialize the Databases service
const databases = new Databases(client);

const Sign_in = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [time, setTime] = useState('');
  const [bio, setBio] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setIf] = useState(1); // Assuming default is 1, change as needed

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const signIn = async () => {
    try {
      await deleteExistingSession(); // Delete any existing session before signing in

      // Create session for user
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session Data:', session);

      if (session && session.$id) {
        setCurrentUser(email);
        profile_page(); // Go to profile page

        // Fetch user bio
        await fetchUserBio(email);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Failed to sign in, please check your credentials.');
    }
  };

  const fetchUserBio = async (userEmail) => {
    try {
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        [Query.equal('Email', userEmail)] // Query by user email
      );

      if (response.documents.length > 0) {
        const userBio = response.documents[0].Bio; // Use 'Bio' (capital B) as defined in the schema
        setBio(userBio); // Update bio state
      } else {
        setBio(''); // No bio found
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions(); // List all sessions

      // Check if there's an active session and delete it
      if (sessions.total > 0) {
        await account.deleteSession('current'); // Delete the active session
        console.log('Existing session deleted.');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Enter your email"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Enter your password"
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={signIn} />
      <Button title="Sign Up" onPress={() => Sign_up()} />
    </View>
  );
};

export default Sign_in;