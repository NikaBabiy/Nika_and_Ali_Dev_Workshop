import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert ,Linking} from 'react-native';
import UUID from 'react-native-uuid';
import { Query, Account, Databases, Client } from 'appwrite';
import { profile_page } from '../app/colab_profile'; // Assuming this function navigates to the profile page
import {Sign_in} from '../app/colab_signin';


const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
  .setProject('67cda0b40018d09b93a6');  // Your Appwrite Project ID

// Initialize the Account service
const account = new Account(client);

// Initialize the Databases service
const databases = new Databases(client);

const Sign_up = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [time, setTime] = useState('');
  const [bio, setBio] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [screenState, setScreenState] = useState(0); // 0: Sign Up, 1: Sign In, 2: Profile
  const [name,setName] = useState('')


  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions();
      if (sessions.total > 0) {
        await account.deleteSession('current');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const createUser = async () => {
    try {
      await deleteExistingSession();
      const userId = UUID.v4();
      const response = await account.create(userId, email, password);
      setCurrentUser(response.email);
      profile_page(); // Go to profile page
      await saveUserBio(response.email);
    } catch (error) {
      Alert.alert('Error', 'Error creating account, please try again.');
    }
  };

  const navigateToSignIn = () => {
      // If you're using Linking to go to a separate URL (could be a web URL or external app link)
      Linking.openURL('/colab_signin'); // Replace with the actual URL
    };

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ padding: 20 }}>
       (
        <>
          <Text>Create your account</Text>
          <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} style={styles.input} />
          <TextInput placeholder="Enter your name" value={name} onChangeText={setName} style={styles.input} />
          <TextInput placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
          <TextInput placeholder="Enter your bio" value={bio} onChangeText={setBio} style={styles.input} />
          <Button title="Sign Up" onPress={createUser} />
          <Button title="Already have an account? Sign In" onPress={navigateToSignIn} />
        </>
      )
    </View>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
};

export default Sign_up;