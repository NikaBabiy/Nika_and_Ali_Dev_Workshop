import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import '../assets/styles.css';
import { Button } from 'react-native-web';

export default function ProjectSelection() {
  return (
    <View>
     <h1> Hello! please choose which project you with to see now </h1>
      <Link href="/ali_milestones">
        <Button title="Ali's Milestones" />
      </Link>
      
      <Link href="/Nika_milestones">
        <Button title="Nika's Milestones" />
      </Link>
      
      <Link href="/colab_signup">
        <Button title="Our MVP" />
      </Link>
    </View>
  );
}