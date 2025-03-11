import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Query, Account, Databases, Client } from 'appwrite';

// Appwrite setup
const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
  .setProject('67cda0b40018d09b93a6');  // Your Appwrite Project ID

const account = new Account(client);
const databases = new Databases(client);

const Sign_in = ({ navigation }) => {  // Add navigation prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [time, setTime] = useState('');
  const [bio, setBio] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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

      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session Data:', session);

      if (session && session.$id) {
        setCurrentUser(email);
        // Go to profile page using navigation
        navigation.navigate('Profile');  // Use React Navigation to navigate to 'Profile'

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
        [Query.equal('Email', userEmail)]
      );

      if (response.documents.length > 0) {
        const userBio = response.documents[0].Bio;
        setBio(userBio);
      } else {
        setBio('');
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions();
      if (sessions.total > 0) {
        await account.deleteSession('current');
        console.log('Existing session deleted.');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const navigateToSignUp = () => {
    // Navigate to Sign Up screen using React Navigation
    navigation.navigate('SignUp'); // Navigate to Sign Up screen
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
      <Button title="Go to Sign Up" onPress={navigateToSignUp} />
    </View>
  );
};

export default Sign_in;

