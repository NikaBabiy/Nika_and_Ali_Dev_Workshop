import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import TinderCard from 'react-native-deck-swiper'; // Use a React Native compatible card swiper
import logopic from '../assets/images/logopic.png';

// Simple Navbar Component
function Navbar() {
  return (
    <View style={styles.navbar}>
      <View style={styles.navLinks}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Logo Component on the Left Side
function Logo() {
  return (
    <View style={styles.logoContainer}>
      <Image source={logopic} style={styles.logo} />
    </View>
  );
}

// Dummy hook to simulate user profile.
const useUserProfile = () => {
  return {
    userSchoolName: "ABC International School",
    isIsraeli: true, // if true, show Palestinian schools
    userLocation: { lat: 32.0853, lng: 34.7818 }, // Example: Tel Aviv coordinates
  };
};

// Dummy distance calculation using the Haversine formula.
const calculateDistance = (loc1, loc2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Earth's radius in km
  const dLat = toRad(loc2.lat - loc1.lat);
  const dLng = toRad(loc2.lng - loc1.lng);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(loc1.lat)) *
            Math.cos(toRad(loc2.lat)) *
            Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1);
};

function ColabHomepage() {
  const [schools, setSchools] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isIsraeli, userLocation } = useUserProfile();

  const cardRef = useRef(null);

  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        name: 'Al-Quds Primary School',
        description: 'Focusing on language exchange programs.',
        nationality: 'Palestinian',
        location: { lat: 31.7683, lng: 35.2137 },
        rating: 4.2,
      },
      {
        id: 2,
        name: 'Bethlehem Secondary School',
        description: 'Promoting STEM education and cultural exchange.',
        nationality: 'Palestinian',
        location: { lat: 31.7054, lng: 35.2024 },
        rating: 4.5,
      },
      {
        id: 3,
        name: 'Jerusalem Central Academy',
        description: 'Excellent arts and music programs.',
        nationality: 'Israeli',
        location: { lat: 31.7683, lng: 35.2137 },
        rating: 4.0,
      }
    ];

    const filteredSchools = dummyData.filter(school => {
      return isIsraeli ? school.nationality === 'Palestinian' : school.nationality === 'Israeli';
    });

    const sortedSchools = filteredSchools.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.location);
      const distB = calculateDistance(userLocation, b.location);
      return distA - distB;
    });

    setSchools(sortedSchools);
  }, [isIsraeli, userLocation]);

  const handleSwipe = (direction, schoolId) => {
    console.log(`Swiped ${direction} on school ${schoolId}`);
    setCurrentIndex(prev => prev + 1);
  };

  const swipeLeft = () => {
    if (cardRef.current) {
      cardRef.current.swipeLeft();
    }
  };

  const swipeRight = () => {
    if (cardRef.current) {
      cardRef.current.swipeRight();
    }
  };

  if (currentIndex >= schools.length) {
    return (
      <View style={styles.container}>
        <Navbar />
        <Text style={styles.noSchoolsText}>
          No more schools to match with right now!
        </Text>
      </View>
    );
  }

  const currentSchool = schools[currentIndex];
  const distance = calculateDistance(userLocation, currentSchool.location);

  return (
    <View style={styles.container}>
      <Navbar />
      <Logo />
      <View style={styles.cardContainer}>
        <TinderCard
          ref={cardRef}
          key={currentSchool.id}
          onSwipe={(dir) => handleSwipe(dir, currentSchool.id)}
          preventSwipe={['up', 'down']}
        >
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{currentSchool.name}</Text>
            <Text style={styles.cardDescription}>{currentSchool.description}</Text>
            <Text style={styles.cardRating}>Rating: {currentSchool.rating} / 5</Text>
            <Text>Distance: {distance} km</Text>
          </View>
        </TinderCard>
        <View style={styles.swipeButtonsContainer}>
          <TouchableOpacity onPress={swipeLeft} style={styles.swipeButton}>
            <Text style={styles.buttonText}>Dislike</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={swipeRight} style={styles.swipeButton}>
            <Text style={styles.buttonText}>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Styles for the ProjectSelection component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'flex-start',
  },
  navbar: {
    width: '100%',
    backgroundColor: '#1a1a2e',
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navLinks: {
    flexDirection: 'row',
  },
  navItem: {
    marginHorizontal: 10,
  },
  navText: {
    color: '#f9f9f9ff',
  },
  logoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    alignItems: 'center',
  },
  logo: {
    height: 40,
    width: 40,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 280,
    height: 350,
    backgroundColor: '#aec391',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    justifyContent: 'space-between',
    marginTop: 50, // Added margin to push card lower
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  cardRating: {
    fontSize: 14,
    marginBottom: 10,
  },
  swipeButtonsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  swipeButton: {
    padding: 10,
    backgroundColor: '#64adc3',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noSchoolsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#232323',
  },
});

export default ColabHomepage;


