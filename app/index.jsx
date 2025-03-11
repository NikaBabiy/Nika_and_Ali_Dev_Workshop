import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProjectSelection() {
  return (
    <View style={styles.projectCardsContainer}>
      {/* Card 1 */}
      <View style={[styles.projectCard, styles.card1]}>
        <Text style={styles.cardTitle}>Ali's Milestones</Text>
        <Text style={styles.cardDescription}>Ali's amazing milestones</Text>
      </View>

      {/* Card 2 */}
      <View style={[styles.projectCard, styles.card2]}>
        <Text style={styles.cardTitle}>Nika's Milestones</Text>
        <Text style={styles.cardDescription}>Nika's amazing milestones</Text>
      </View>

      {/* Card 3 */}
      <View style={[styles.projectCard, styles.card3]}>
        <Text style={styles.cardTitle}>Our MVP</Text>
        <Text style={styles.cardDescription}>Our great Minimum Viable Product.</Text>
      </View>
    </View>
  );
}

// Styles for the ProjectSelection component
const styles = StyleSheet.create({
  projectCardsContainer: {
    flexDirection: 'row', // Align cards horizontally
    flexWrap: 'wrap',     // Wrap cards onto the next line if necessary
    justifyContent: 'center', // Center the cards
    padding: 10,
    marginTop: 50,         // Add margin top to move the cards down
  },
  projectCard: {
    width: 250,            // Width of each card
    height: 150,           // Height of each card
    margin: 10,            // Margin between cards
    borderRadius: 8,       // Rounded corners
    padding: 10,           // Padding inside the card
    backgroundColor: '#ececec', // Light background color for the card
    shadowColor: '#000',   // Shadow color for the card
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  card1: {
    backgroundColor: '#f1c40f', // Yellow background for card 1
  },
  card2: {
    backgroundColor: '#e74c3c', // Red background for card 2
  },
  card3: {
    backgroundColor: '#2ecc71', // Green background for card 3
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: '#00001',
  },
});