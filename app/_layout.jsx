import React from 'react';
import { Stack } from 'expo-router';
import Layout from '../components/Layout';

export default function RootLayout() {
  return (
    <Layout>
      <Stack screenOptions={{ headerShown: false }} />
    </Layout>
  );
}
