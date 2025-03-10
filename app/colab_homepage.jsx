import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import TinderCard from 'react-native-deck-swiper'; // Use a React Native compatible card swiper
import logopic from '../assets/images/logopic.png';

// Simple Navbar Component
function Navbar() {
  return (
    <View style={{
      width: '100%',
      backgroundColor: '#1a1a2e',
      padding: 10,
      color: '#e94560',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <Text style={{ color: '#f9f9f9ff' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginHorizontal: 10 }}>
          <Text style={{ color: '#f9f9f9ff' }}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Logo Component on the Left Side
function Logo() {
  return (
    <View style={{
      position: 'absolute',
      top: 10,
      left: 10,
      display: 'flex',
      alignItems: 'center',
    }}>
      <Image source={logopic} style={{ height: 40 }} />
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
      <View>
        <Navbar />
        <Text style={{ textAlign: 'center', marginTop: 20, color: '#232323' }}>
          No more schools to match with right now!
        </Text>
      </View>
    );
  }

  const currentSchool = schools[currentIndex];
  const distance = calculateDistance(userLocation, currentSchool.location);

  return (
<<<<<<< HEAD
    <View style={{ minHeight: '100vh', overflow: 'auto' }}>
      <Navbar />
      <Logo />
      <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 20 }}>
=======
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Logo />
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
>>>>>>> c50942089f504fe63250f92e552d9bfb2e5421b3
        <TinderCard
          ref={cardRef}
          key={currentSchool.id}
          onSwipe={(dir) => handleSwipe(dir, currentSchool.id)}
          preventSwipe={['up', 'down']}
        >
          <View
            style={{
<<<<<<< HEAD
              width: 300,
              height: 400,
=======
              width: '280px', // Reduced width
              height: '350px', // Reduced height
>>>>>>> c50942089f504fe63250f92e552d9bfb2e5421b3
              backgroundColor: '#aec391',
              padding: 10,
              boxShadow: '0 0 5px rgba(0,0,0,0.3)',
              borderRadius: 8,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'grab',
              color: '#232323',
<<<<<<< HEAD
=======
              marginTop: '50px' // Added margin to push it lower
>>>>>>> c50942089f504fe63250f92e552d9bfb2e5421b3
            }}
          >
            <View>
              <Text style={{ marginBottom: 10 }}>{currentSchool.name}</Text>
              <Text style={{ marginBottom: 10 }}>{currentSchool.description}</Text>
              <Text style={{ marginBottom: 10 }}>
                Rating: {currentSchool.rating} / 5
              </Text>
            </View>
            <View>
              <Text>Distance: {distance} km</Text>
            </View>
          </View>
        </TinderCard>
        <View style={{ marginTop: 10, flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={swipeLeft} style={{ padding: 10, backgroundColor: '#64adc3' }}>
            <Text>Dislike</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={swipeRight} style={{ padding: 10, backgroundColor: '#64adc3' }}>
            <Text>Like</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default ColabHomepage;

