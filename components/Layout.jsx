import React from 'react';
import { View } from 'react-native';
import NavBar from './NavBar';

export default function Layout({ children }) {
  return (
    <View style={{ flex: 1 }}>
      <NavBar />
      {children}
    </View>
  );
}
