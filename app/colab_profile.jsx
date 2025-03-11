import React, { useEffect, useState } from 'react';
import {StyleSheet,Text,View,Button,Linking,TextInput,FlatList,Image,Alert,TouchableOpacity} from 'react-native';
import { Client, Account, Query } from 'appwrite';
import { Databases } from 'appwrite';
import UUID from 'react-native-uuid'; 
import { v4 as uuidv4 } from 'uuid';
// Initialize the Databases service




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

function ProfileScreen () {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState(''); // State for bio
  const [currentUser, setCurrentUser] = useState(null);
  const [if1, setIf] = useState(0); // 0 for sign up, 1 for sign in, 2 for profile
  const [time, setTime] = useState('');

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Sign up user
  const createUser = async () => {
    try {
      await deleteExistingSession(); // Delete any existing session before creating a new one

      const userId = UUID.v4(); // Generate unique user ID

      // Create the user
      const response = await account.create(userId, email, password);
      console.log('User created:', response);

      // If user creation is successful, store the email as currentUser
      setCurrentUser(response.email);
      setIf(2); // Navigate to profile screen

      // Store user bio
      await saveUserBio(response.email);
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Error creating account, please try again.');
    }
  };

  // Sign in user
  const signIn = async () => {
    try {
      // Ensure the email and password are not empty
      if (!email || !password) {
        Alert.alert('Error', 'Email and Password are required.');
        return;
      }
  
      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session created:', session);
  
      // Check if session is created and move to profile screen
      if (session && session.$id) {
        Alert.alert('Success', 'Successfully signed in!');
        // Proceed with the profile page
      }
    } catch (error) {
      console.error('Error during sign in:', error);
  
      // Handle the rate limit error
      if (error.message && error.message.includes('Rate limit')) {
        Alert.alert('Error', 'Rate limit exceeded. Please try again after some time.');
      } else {
        Alert.alert('Error', 'Failed to sign in, please check your credentials.');
      }
    }
  };
  
  
  
  

  // Sign out user
  const signOut = async () => {
    try {
      await account.deleteSession('current'); // Delete current session
      setCurrentUser(null);
      setIf(1); // Navigate to sign-in screen
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out, please try again.');
    }
  };

  // Delete any existing session
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

  // Save user bio to the database
  const saveUserBio = async (userEmail) => {
    try {
      const response = await databases.createDocument(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        'unique()', // Auto-generated document ID
        {
          Email: userEmail,  // Store user email
          Bio: bio,          // Use 'Bio' (with capital B) as defined in your collection
        }
      );
      console.log('Bio saved:', response);
    } catch (error) {
      console.error('Error saving bio:', error);
      Alert.alert('Error', 'Failed to save bio, please try again.');
    }
  };

  // Fetch user bio from the database
  const fetchUserBio = async (userEmail) => {
    try {
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        [
          Query.equal('Email', userEmail), // Query by user email
        ]
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

  // Render UI for Sign Up
  if (if1 === 0){
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

  // Render Sign In UI
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
        <Button title="sign up" onPress={() => setIf(0)} />

      </View>
    );
  }

  // Render Profile UI
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
        <Button title="Save Bio" onPress={() => saveUserBio(currentUser)} />

        <Button title="Sign Out" onPress={signOut} />
      </View>
    );
  }

  return null; // In case if1 is not 0, 1, or 2
};

export default ProfileScreen;