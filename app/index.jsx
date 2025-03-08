import React from 'react';
import { View, Text } from 'react-native';
import '../assets/styles.css';
import { Button } from 'react-native-web';

export default function ProjectSelection() {
  return (
    <>
    <Link
      href="/ali_milstone.jsx">
      <Button> Ali's Milstones</Button>
    </Link>
    
    <Link
      href="/Nika_milstones">
        <Button> Nika's Milstones</Button>
      </Link>
      
      <Link
        href="/colab.jsx">
        <Button> Our MVP</Button>
      </Link></>
  )