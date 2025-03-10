const sign_in = () =>{

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
          setIf(2); // Go to profile page
  
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
    <Button title="sign up" onPress={() => setIf(0)} />

  </View>
);
}