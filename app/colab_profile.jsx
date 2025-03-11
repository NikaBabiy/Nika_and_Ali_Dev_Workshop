import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert } from 'react-native';
import { Client, Account, Query } from 'appwrite';
import { Databases } from 'appwrite';
import UUID from 'react-native-uuid';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

// Initialize Appwrite client
const client = new Client();
client.setEndpoint('https://cloud.appwrite.io/v1')  // Appwrite API endpoint
      .setProject('67cda0b40018d09b93a6');  // Your Appwrite Project ID

// Initialize the Account service
const account = new Account(client);

// Initialize the Databases service
const databases = new Databases(client);

function Navbar() {
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#333',
      padding: '1rem',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <a href="/colab_homepage" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
        Home
      </a>
      <a href="/colab_profile" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
        Profile
      </a>
    </div>
  );
}

function ProfileScreen() {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [time, setTime] = useState('');


  const checkUserBio = async (userEmail) => {
    try {
      // Fetch user bio from the database using the user's email
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        [Query.equal('Email', userEmail)] // Query to find the user by their email
      );
  
      // Check if a document is found for the user
      if (response.documents.length > 0) {
        const userBio = response.documents[0].Bio;
        setBio(userBio); // Set the fetched bio in the state
        return userBio; // Return the bio
      } else {
        setBio(''); // If no bio is found, set an empty bio
        return ''; // Return empty bio
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
      return ''; // Return empty bio in case of error
    }
  };
  


  const checkActiveSession = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        setCurrentUser(session);
        return 2; // Session found, return 2
      } else {
        return 0; // No session found, return 0
      }
    } catch (error) {
      console.error('Error checking active session:', error);
      return 0;
    }
  };

  useEffect(() => {
    // Check if a user session exists when the app starts
    checkActiveSession().then(status => {
      if (status === 2) {
        setIf(2);
        checkUserBio(currentUser); // Call the function to check bio if the session is active
      }
    });
  
    // Update time every second
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);
  
    return () => clearInterval(interval);
  }, [currentUser]); // Make sure to include currentUser as a dependency
  

  const [if1, setIf] = useState(0);

  const createUser = async () => {
    try {
      await deleteExistingSession(); // Delete any existing session before creating a new one

      const userId = UUID.v4(); // Generate unique user ID

      // Create the user
      const response = await account.create(userId, email, password);
      console.log('User created:', response);

      // Store session in AsyncStorage
      await AsyncStorage.setItem('userSession', email); // Store email in AsyncStorage
      setCurrentUser(email);
      setIf(2); // Navigate to profile screen

      // Save the user bio in the database after creating the account
      await saveUserBio(response.email, bio); // Save bio immediately after account creation
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Error creating account, please try again.');
    }
  };

  const signIn = async () => {
    try {
      await deleteExistingSession(); // Delete any existing session before signing in

      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session Data:', session);

      if (session && session.$id) {
        // Save session email to AsyncStorage
        await AsyncStorage.setItem('userSession', email);
        setCurrentUser(email);
        setIf(2); // Go to profile page

        // Fetch user bio after sign-in
        await fetchUserBio(email);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Failed to sign in, please check your credentials.');
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current'); // Delete current session
      await AsyncStorage.removeItem('userSession'); // Remove session from AsyncStorage
      setCurrentUser(null);
      setIf(1); // Navigate to sign-in screen
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out, please try again.');
    }
  };

  const deleteExistingSession = async () => {
    try {
      const sessions = await account.listSessions(); // List all sessions

      if (sessions.total > 0) {
        await account.deleteSession('current');
        console.log('Existing session deleted.');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const saveUserBio = async (userEmail, bioContent) => {
    try {
      const response = await databases.createDocument(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        'unique()', // Document ID (ensure it's unique)
        {
          Email: userEmail, 
          Bio: bioContent, 
        }
      );
      console.log('Bio saved:', response);
    } catch (error) {
      console.error('Error saving bio:', error);
      Alert.alert('Error', 'Failed to save bio, please try again.');
    }
  };

  const updateUserBio = async (userEmail, newBio) => {
    try {
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3',
        '67cda18c0013cc528fce',
        [Query.equal('Email', userEmail)]
      );

      if (response.documents.length > 0) {
        const documentId = response.documents[0].$id; // Get the document ID
        const updateResponse = await databases.updateDocument(
          '67cda1500033be49b7a3',
          '67cda18c0013cc528fce',
          documentId, // Document ID to update
          { Bio: newBio }
        );
        console.log('Bio updated:', updateResponse);
      } else {
        Alert.alert('Error', 'Bio not found for this user');
      }
    } catch (error) {
      console.error('Error updating bio:', error);
      Alert.alert('Error', 'Failed to update bio, please try again.');
    }
  };

  const fetchUserBio = async (userEmail) => {
    try {
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3', 
        '67cda18c0013cc528fce', 
        [Query.equal('Email', userEmail)]
      );

      if (response.documents.length > 0) {
        const userBio = response.documents[0].Bio;
        setBio(userBio); // Set the fetched bio in the state
      } else {
        setBio(''); // No bio found for this user
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  if (if1 === 0) {
    return (
      <View style={{ padding: 20 }}>
        <Navbar />
        <Text>Create your account</Text>
        <TextInput
          placeholder="Enter your email"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Enter your name"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          placeholder="Enter your password"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          placeholder="Enter your bio"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
          value={bio}
          onChangeText={setBio}
        />
        <Button title="Sign Up" onPress={createUser} />
        <Button title="Already have an account? Sign In" onPress={() => setIf(1)} />
      </View>
    );
  }

  if (if1 === 1) {
    return (
      <View style={{ padding: 20 }}>
        <Navbar />
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
        <Button title="Sign Up" onPress={() => setIf(0)} />
      </View>
    );
  }

  if (if1 === 2) {
    return (
      <View style={{ padding: 20 }}>
        <Navbar />
        <Text>Welcome, {currentUser}!</Text>
        <Text>Current Time: {time}</Text>
        <Text>Your Bio: {bio}</Text>

        <TextInput
          placeholder="Update your bio"
          style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
          value={bio}
          onChangeText={setBio}
        />
        <Button title="Save Bio" onPress={() => updateUserBio(currentUser, bio)} />
        <Button title="Sign Out" onPress={signOut} />
      </View>
    );
  }

  return null;
}

export default ProfileScreen;

