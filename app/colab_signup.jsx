import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { account, databases } from './config'; // Ensure correct imports
import UUID from 'react-native-uuid';
import { Query } from 'appwrite';

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
            setScreenState(2);
            await saveUserBio(response.email);
        } catch (error) {
            Alert.alert('Error', 'Error creating account, please try again.');
        }
    };

    const signIn = async () => {
        try {
            await deleteExistingSession();
            const session = await account.createEmailPasswordSession(email, password);
            if (session && session.$id) {
                setCurrentUser(email);
                setScreenState(2);
                await fetchUserBio(email);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to sign in, please check your credentials.');
        }
    };

    const signOut = async () => {
        try {
            await account.deleteSession('current');
            setCurrentUser(null);
            setScreenState(1);
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

    const fetchUserBio = async (userEmail) => {
        try {
            const response = await databases.listDocuments('67cda1500033be49b7a3', '67cda18c0013cc528fce', [Query.equal('Email', userEmail)]);
            setBio(response.documents.length > 0 ? response.documents[0].Bio : '');
        } catch (error) {
            console.error('Error fetching bio:', error);
        }
    };

    return (
        <View style={{ padding: 20 }}>
            {screenState === 0 && (
                <>
                    <Text>Create your account</Text>
                    <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} style={styles.input} />
                    <TextInput placeholder="Enter your name" value={name} onChangeText={setName} style={styles.input} />
                    <TextInput placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                    <TextInput placeholder="Enter your bio" value={bio} onChangeText={setBio} style={styles.input} />
                    <Button title="Sign Up" onPress={createUser} />
                    <Button title="Already have an account? Sign In" onPress={() => setScreenState(1)} />
                </>
            )}
            {screenState === 1 && (
                <>
                    <Text>Sign In</Text>
                    <TextInput placeholder="Enter your email" value={email} onChangeText={setEmail} style={styles.input} />
                    <TextInput placeholder="Enter your password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                    <Button title="Sign In" onPress={signIn} />
                    <Button title="Sign Up" onPress={() => setScreenState(0)} />
                </>
            )}
            {screenState === 2 && (
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
