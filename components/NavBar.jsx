import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function NavBar() {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 15, backgroundColor: '#333' }}>
      <Link href="/" asChild>
        <TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18 }}>Home</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/ali_milestones" asChild>
        <TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18 }}>Ali's Milestones</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/Nika_milestones" asChild>
        <TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18 }}>Nika's Milestones</Text>
        </TouchableOpacity>
      </Link>
      <Link href="/colab_homepage" asChild>
        <TouchableOpacity>
          <Text style={{ color: 'white', fontSize: 18 }}>MVP</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
