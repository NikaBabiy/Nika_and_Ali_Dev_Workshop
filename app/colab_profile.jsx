import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { Query, Account, Databases, Client } from 'appwrite';
import { sign_in_page } from './colab_signin';

const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
  .setProject('67cda0b40018d09b93a6');  // Your Appwrite Project ID

// Initialize the Account service
const account = new Account(client);

// Initialize the Databases service
const databases = new Databases(client);

const ProfileScreen = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [screenState, setScreenState] = useState(0); // 0: Sign Up, 1: Sign In, 2: Profile
  const [time, setTime] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  const signOut = async () => {
    try {
      await account.deleteSession('current');
      setCurrentUser(null);
      sign_in_page(); // Assuming this function navigates to sign-in page
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out, please try again.');
    }
  };

  const saveUserBio = async (userEmail) => {
    try {
      await databases.createDocument('67cda1500033be49b7a3', '67cda18c0013cc528fce', 'unique()', { Email: userEmail, Bio: bio });
    } catch (error) {
      Alert.alert('Error', 'Failed to save bio, please try again.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {(
        <>
          <Text>Welcome, {currentUser}!</Text>
          <Text>Current Time: {time}</Text>
          <Text>Your Bio: {bio}</Text>
          <TextInput placeholder="Update your bio" value={bio} onChangeText={setBio} style={styles.input} />
          <Button title="Save Bio" onPress={() => saveUserBio(currentUser)} />
          <Button title="Sign Out" onPress={signOut} />
        </>
      )}
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

export default ProfileScreen;