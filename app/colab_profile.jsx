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
      const response = await databases.listDocuments(
        '67cda1500033be49b7a3', // Database ID
        '67cda18c0013cc528fce', // Collection ID
        [Query.equal('Email', userEmail)] // Query to find the user by their email
      );

      if (response.documents.length > 0) {
        const userBio = response.documents[0].Bio;
        setBio(userBio);
        return userBio;
      } else {
        setBio('');
        return '';
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
      return '';
    }
  };

  const checkActiveSession = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        setCurrentUser(session);
        return 2;
      } else {
        return 0;
      }
    } catch (error) {
      console.error('Error checking active session:', error);
      return 0;
    }
  };

  useEffect(() => {
    checkActiveSession().then(status => {
      if (status === 2) {
        setIf(2);
        checkUserBio(currentUser);
      }
    });

    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const [if1, setIf] = useState(0);

  const createUser = async () => {
    try {
      await deleteExistingSession();

      const userId = UUID.v4();

      const response = await account.create(userId, email, password);
      console.log('User created:', response);

      await AsyncStorage.setItem('userSession', email);
      setCurrentUser(email);
      setIf(2);

      await saveUserBio(response.email, bio);
    } catch (error) {
      console.error('Error creating account:', error);
      Alert.alert('Error', 'Error creating account, please try again.');
    }
  };

  const signIn = async () => {
    try {
      await deleteExistingSession();

      const session = await account.createEmailPasswordSession(email, password);
      console.log('Session Data:', session);

      if (session && session.$id) {
        await AsyncStorage.setItem('userSession', email);
        setCurrentUser(email);
        setIf(2);
        await fetchUserBio(email);
      }
    } catch (error) {
      console.error('Error signing in:', error);
      Alert.alert('Error', 'Failed to sign in, please check your credentials.');
    }
  };

  const signOut = async () => {
    try {
      await account.deleteSession('current');
      await AsyncStorage.removeItem('userSession');
      setCurrentUser(null);
      setIf(1);
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out, please try again.');
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

  const saveUserBio = async (userEmail, bioContent) => {
    try {
      const response = await databases.createDocument(
        '67cda1500033be49b7a3',
        '67cda18c0013cc528fce',
        'unique()',
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
        const documentId = response.documents[0].$id;
        const updateResponse = await databases.updateDocument(
          '67cda1500033be49b7a3',
          '67cda18c0013cc528fce',
          documentId,
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
        setBio(userBio);
      } else {
        setBio('');
      }
    } catch (error) {
      console.error('Error fetching bio:', error);
    }
  };

  if (if1 === 0) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text style={styles.title}>Create your account</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            placeholder="Enter your name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            placeholder="Enter your bio"
            style={styles.input}
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <Button title="Sign Up" onPress={createUser} color="#64adc3" />
        <View style={styles.buttonSpacer} />
        <Text style={styles.link} onPress={() => setIf(1)}>Already have an account? Sign In</Text>
      </View>
    );
  }

  if (if1 === 1) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text style={styles.title}>Sign In</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="Enter your email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Enter your password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <Button title="Sign In" onPress={signIn} color="#64adc3" />
        <View style={styles.buttonSpacer} />
        <Text style={styles.link} onPress={() => setIf(0)}>Sign Up</Text>
      </View>
    );
  }

  if (if1 === 2) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text style={styles.title}>Welcome, {currentUser}!</Text>
        <Text>Current Time: {time}</Text>
        <Text>Your Bio: {bio}</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Update your bio</Text>
          <TextInput
            placeholder="Update your bio"
            style={styles.input}
            value={bio}
            onChangeText={setBio}
          />
        </View>
        <Button title="Save Bio" onPress={() => updateUserBio(currentUser, bio)} color="#64adc3" />
        <View style={styles.buttonSpacer} />
        <Text style={styles.link} onPress={signOut}>Sign Out</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#021F54',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#232323',
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingLeft: 10,
    fontSize: 16,
    width: '100%',
  },
  buttonSpacer: {
    marginVertical: 20,
  },
  link: {
    color: '#5cb85c',
    marginTop: 10,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default ProfileScreen;
