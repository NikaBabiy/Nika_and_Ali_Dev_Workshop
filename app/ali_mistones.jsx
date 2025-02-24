import React, { useEffect, useState } from 'react';
import {StyleSheet,Text,View,Button,TextInput,FlatList,Image,Alert,TouchableOpacity} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Buttonbutton from '../components/button.jsx';
import { Client, Account, Query } from 'appwrite';
import { Databases } from 'appwrite';
import UUID from 'react-native-uuid'; 
import { v4 as uuidv4 } from 'uuid';
// Initialize the Databases service


// Initialize the Appwrite client
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject('67af369100106abb74a2');

const databases = new Databases(client);
// Initialize the Account service
const account = new Account(client);






// Function to Sign In a user
// const signIn = async (email, password) => {
//   try {
//     const session = await account.createSession(email, password);
//     console.log('Signed in:', session);
//     return session;
//   } catch (error) {
//     console.error('Error signing in:', error);
//   }
// };

// // Function to Create a Task
// const createTask = async (userId, title) => {
//   try {
//     const response = await databases.createDocument(
//       '[YOUR_DATABASE_ID]',    // Your database ID
//       '[YOUR_COLLECTION_ID]',   // Your tasks collection ID
//       'unique()',               // Unique task ID
//       {
//         title: title,           // Title of the task
//         completed: false,       // Task is not completed by default
//         userId: userId          // Associate task with the signed-in user
//       }
//     );
//     console.log('Task created:', response);
//   } catch (error) {
//     console.error('Error creating task:', error);
//   }
// };

// // Function to Get Tasks
// const getTasks = async (userId) => {
//   try {
//     const tasks = await databases.listDocuments(
//       '[YOUR_DATABASE_ID]',    // Your database ID
//       '[YOUR_COLLECTION_ID]',   // Your tasks collection ID
//       [
//         Query.equal('userId', userId) // Filter tasks by userId
//       ]
//     );
//     console.log('User tasks:', tasks);
//     return tasks;
//   } catch (error) {
//     console.error('Error getting tasks:', error);
//   }
// };

// // Function to Update Task (e.g., mark as completed)
// const updateTask = async (taskId, updatedData) => {
//   try {
//     const response = await databases.updateDocument(
//       '[YOUR_DATABASE_ID]',    // Your database ID
//       '[YOUR_COLLECTION_ID]',   // Your tasks collection ID
//       taskId,                   // The ID of the task to update
//       updatedData               // The updated data (e.g., mark as completed)
//     );
//     console.log('Task updated:', response);
//   } catch (error) {
//     console.error('Error updating task:', error);
//   }
// };

// // Example usage: First, sign in the user, then add tasks
// const signInAndManageTasks = async () => {
//   const email = name;  // Replace with the user's email
//   const password = Password;  // Replace with the user's password

//   // Sign in the user
//   const session = await signIn(email, password);
  
//   if (session) {
//     const userId = session.userId;  // Get user ID from session
    
//     // Create a task for the signed-in user
//     await createTask(userId, 'Buy groceries');
//     await createTask(userId, 'Finish coding project');
    
//     // Fetch tasks for the user
//     const tasks = await getTasks(userId);
    
//     // Mark the first task as completed
//     if (tasks.documents.length > 0) {
//       await updateTask(tasks.documents[0].$id, { completed: true });
//     }
    
//     console.log('All tasks managed successfully.');
//   }
// };

// // Call the function to handle sign-in and task management
// signInAndManageTasks();


const HomeScreen = () => {  
  const[time,setTime] = useState('')
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city.trim()) {
      Alert.alert('Error', 'Please enter a city name.');
      return;
    }
  
    setLoading(true); // بدء تحميل البيانات
    
    // استخدام اسم المدينة المدخل من قبل المستخدم في الـ URL
    const apiUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=us&key=ESWU2BMXSKRQU9A2HZKA2NMU9&contentType=json`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch weather information.');
      }
  
      const data = await response.json();
  
      // تحقق من هيكل البيانات المسترجعة من Visual Crossing API
      if (data && data.currentConditions) {
        setWeather({
          city: city, // اسم المدينة المدخل من قبل المستخدم
          temperature: data.currentConditions.temp, // درجة الحرارة
          description: data.currentConditions.conditions, // وصف الطقس
          icon: data.currentConditions.icon, // رمز الطقس (إذا كان متوفرًا)
        });
      } else {
        throw new Error('Weather data not available.');
      }
  
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000); // Update every second
  
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []); 
 
  

  return (
    <View style={styles.container}>
      <View style={styles.timeBox}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <Text style={styles.title}>Weather Info</Text>
      <TextInput
        placeholder="Enter city name"
        style={styles.input}
        value={city}
        onChangeText={(text) => setCity(text)}
      />
      <Button title="Get Weather" color="#4682B4" onPress={fetchWeather} />
      {loading && <Text>Loading...</Text>}
      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherText}>City: {weather.city}</Text>
          <Text style={styles.weatherText}>Temperature: {weather.temperature}°C</Text>
          <Text style={styles.weatherText}>Description: {weather.description}</Text>
          <Image source={{ uri: weather.icon }} style={styles.weatherIcon} />
        </View>
      )}
    </View>
  );
};




const ProfileScreen = () => {
  const [Password, setPas] = useState('');
  const [time, setTime] = useState('');
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [if1, setIf] = useState(0); // 0 for sign up, 1 for sign in, 2 for To-Do list
  const [currentUser, setCurrentUser] = useState(null);

  const client = new Client();
  client.setEndpoint("https://cloud.appwrite.io/v1").setProject('67af369100106abb74a2');
  const account = new Account(client);

  // Update the time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval
  }, []);

  const getUserProfile = async (email) => {
    try {
      const response = await databases.listDocuments(
        '67af39c50007635d224a',   // Your actual database ID
        '67af39e3002abbe77fba',   // Your actual collection ID
        [
          Query.equal('email', email),  // Query to find documents where email matches
        ]
      );
      console.log('User profile fetched:', response);
      return response.documents;  // Array of matching documents
    } catch (error) {
      console.log('Error fetching user profile:', error);
    }
  };
  
  const storeUserProfile = async (userId, email) => {
    try {
      const response = await databases.createDocument(
        '67af39c50007635d224a',  // Your actual database ID
        '67af39e3002abbe77fba',  // Your actual collection ID
        'unique()',  // Create a unique document ID, or use the userId if you prefer
        {
          userId: userId,
          email: email,
          // Add any other user profile attributes here
        }
      );
      console.log('User profile stored successfully:', response);
    } catch (error) {
      console.log('Error storing user profile:', error);
    }
  };
  
  const updateUserProfile = async (userId, newAttributes) => {
    try {
      const response = await databases.updateDocument(
        '67af39c50007635d224a',   // Your actual database ID
        '67af39e3002abbe77fba',   // Your actual collection ID
        userId,  // Document ID (typically the userId or email if you store it)
        newAttributes  // The new attributes to update in the user profile
      );
      console.log('User profile updated:', response);
    } catch (error) {
      console.log('Error updating user profile:', error);
    }
  };
  


  // Add task to the list
  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), task: input, completed: false }]);
      setInput('');
    }
  };

  // Toggle the completion status of a task
  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  // Delete all tasks
  const deleteList = () => {
    setTasks([]);
  };

  // Rename the user (update the name)
  const backToMainUser = () => {
    setIf(0); // Switch to sign-up
  };

  // Handle sign-up process (Create user using Appwrite)
  const signIn = async () => {
    try {
      // Check if createEmailPasswordSession exists and is a function
      if (typeof account.createEmailPasswordSession === 'function') {
        
        // Check if the user is already logged in
        try {
          const session = await account.getSession('current'); // Try to fetch the active session
          console.log('User is already logged in');
          Alert.alert('User is already logged in');

          setCurrentUser(session.email);  // Set the user info from the current session
          Alert.alert(currentUser);
          setIf(2); // Proceed to the To-Do List page
          return; // Exit as session is active
        } catch (err) {
          if (err.code === 404) {
            console.log('No active session, proceeding with login');
          } else {
            throw err;
          }
        }
  
        // If no active session, proceed to create a new one
        const response = await account.createEmailPasswordSession(email, Password);
        console.log(response); // Debug the response object
        Alert.alert('User1 is already logged in')
        // Check if response has $id (the user's unique identifier)
        if (response && response.$id) {
          setCurrentUser(response.email);  // Set the user email or any other identifier available
          Alert.alert(currentUser);
        } else {
          throw new Error('User not found or session creation failed');
        }
  
        setIf(2); // Proceed to the To-Do List page
  
      } else {
        throw new Error('createEmailPasswordSession method is not available on account');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Invalid credentials, please try again.');
      console.error(error); // Debugging the error
    }
  };
  
  
  
  
  // Updated createUser method (to match Appwrite's expected parameters)
  const createUser = async () => {
    try {
      const userId = UUID.v4(); // Generate a unique UUID for the user using react-native-uuid
      console.log(userId)
      const response = await account.create(userId, email, Password); // Create the user
  
      console.log(response); // Debug the response object
  
      if (response && response.$id) {
        setCurrentUser(response.email); // Set the user email (or other available identifier)
      } else {
        throw new Error('Failed to create user');
      }
  
      setIf(2); // Go directly to the To-Do List page
    } catch (error) {
      Alert.alert('Error', 'Error creating account, please try again.');
      console.error(error); // Debugging the error
    }
  };
  

  // If user is not signed in, show sign-up or sign-in page
  if (if1 === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create your account</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)} // Update email
        />
        <TextInput
          placeholder="Enter your name"
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)} // Update name
        />
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={Password}
          onChangeText={(text) => setPas(text)} // Update password
          secureTextEntry
        />
        <Button title="Sign Up" color="#4682B4" onPress={createUser} />
        <Button title="Already have an account? Sign In" color="#4682B4" onPress={() => setIf(1)} />
      </View>
    );
  }

  // Sign-in page (if user already signed up)
  if (if1 === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)} // Update email for sign-in
        />
        <TextInput
          placeholder="Enter your password"
          style={styles.input}
          value={Password}
          onChangeText={(text) => setPas(text)} // Update password for sign-in
          secureTextEntry
        />
        <Button title="Sign In" color="#4682B4" onPress={signIn} />
      </View>
    );
  }

  // If the user is signed in, show To-Do List page
  if (if1 === 2) {
    return (
      <View style={styles.container}>
        <View style={styles.timeBox}>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        <Text style={styles.title}>To-Do List</Text>
        
        <Text style={styles.UserName}>Welcome, {currentUser}!</Text>

        {/* Task Input */}
        <TextInput
          placeholder="Enter a new task"
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
        />

        <Button title="Add Task" color="#D2691E" onPress={addTask} />
        <Button title="Clear All" color="#D2691E" onPress={deleteList} />
        <Button title="Rename" color="#D2691E" onPress={backToMainUser} />

        {/* To-Do List */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              {/* Clickable task */}
              <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
                <Text
                  style={[
                    styles.taskText,
                    item.completed && styles.completedTask // Apply style for completed task
                  ]}
                >
                  {item.task}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  }

  return null;
};


 

// Example styles (same as before)

  // Fallback if state is something unexpected


const Tab = createBottomTabNavigator();

export default function Index() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarStyle: { backgroundColor: '#D2691E' },
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: '#AAAAAA',
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5DEB3',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D2691E',
    marginBottom: 10,
  },
  input: {
    width: '90%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#D2691E',
    borderRadius: 8,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  UserName:{
    borderWidth: 1,
    borderColor: '#D2691E',
    fontSize: 16,
    color: '#000',
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#D2691E',
    borderColor: '#D2691E',
    width: '90%',
  },
  taskText: {
    fontSize: 16,
    color: '#FFF',
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  weatherText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
  timeBox: {
    position: 'absolute', // Position the box relative to the screen
    top: 10, // 10px from the top
    left: 10, // 10px from the left
    backgroundColor: '#333', // Dark background color
    padding: 10,
    borderRadius: 5, // Rounded corners
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset
    shadowOpacity: 0.3, // Shadow opacity
    shadowRadius: 4, // Shadow radius
    elevation: 5, // For Android shadow support
  },
  timeText: {
    color: 'white', // White text color
    fontSize: 18, // Font size
    fontFamily: 'Arial', // Font family
  },
});