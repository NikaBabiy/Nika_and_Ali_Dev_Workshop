import React, { useState, useEffect, useRef } from 'react';
import TinderCard from 'react-tinder-card';

// Simple Navbar Component
function Navbar() {
  return (
    <div style={{ 
      width: '100%', 
      backgroundColor: '#333', 
      padding: '1rem', 
      color: 'white', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center'
    }}>
      <a href="/colab_homepage" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
        Home
      </a>
      <a href="/colab_profile" style={{ margin: '0 1rem', color: 'white', textDecoration: 'none' }}>
        Profile
      </a>
    </div>
  );
}

// Dummy hook to simulate user profile.
// Replace this with your actual user profile context or props.
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
  
  // Create a ref for the TinderCard to trigger programmatic swipes.
  const cardRef = useRef(null);

  useEffect(() => {
    // Dummy school data
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

    // Filter out schools that match the user's own nationality.
    const filteredSchools = dummyData.filter(school => {
      return isIsraeli ? school.nationality === 'Palestinian' : school.nationality === 'Israeli';
    });

    // (Optional) Sort by distance.
    const sortedSchools = filteredSchools.sort((a, b) => {
      const distA = calculateDistance(userLocation, a.location);
      const distB = calculateDistance(userLocation, b.location);
      return distA - distB;
    });

    setSchools(sortedSchools);
  }, [isIsraeli, userLocation]);

  // Handler when a swipe is completed.
  const handleSwipe = (direction, schoolId) => {
    console.log(`Swiped ${direction} on school ${schoolId}`);
    setCurrentIndex(prev => prev + 1);
  };

  // Programmatically trigger a left swipe.
  const swipeLeft = () => {
    if (cardRef.current) {
      cardRef.current.swipe('left');
    }
  };

  // Programmatically trigger a right swipe.
  const swipeRight = () => {
    if (cardRef.current) {
      cardRef.current.swipe('right');
    }
  };

  // If we've run out of schools, show a message.
  if (currentIndex >= schools.length) {
    return (
      <div>
        <Navbar />
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          No more schools to match with right now!
        </div>
      </div>
    );
  }

  const currentSchool = schools[currentIndex];
  const distance = calculateDistance(userLocation, currentSchool.location);

  return (
    <div>
      {/* Navbar on top */}
      <Navbar />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
        <TinderCard
          ref={cardRef}
          key={currentSchool.id}
          onSwipe={(dir) => handleSwipe(dir, currentSchool.id)}
          onCardLeftScreen={(dir) => console.log('Card left screen: ', dir)}
          preventSwipe={['up', 'down']}
        >
          <div
            style={{
              width: '300px',
              height: '400px',
              backgroundColor: '#fff',
              padding: '1rem',
              boxShadow: '0 0 5px rgba(0,0,0,0.3)',
              borderRadius: '8px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'grab'
            }}
          >
            <div>
              <h2 style={{ margin: '0 0 0.5rem' }}>{currentSchool.name}</h2>
              <p style={{ margin: '0 0 0.5rem' }}>{currentSchool.description}</p>
              <p style={{ margin: '0 0 0.5rem' }}>
                Rating: {currentSchool.rating} / 5
              </p>
            </div>
            <div>
              <p style={{ margin: 0 }}>Distance: {distance} km</p>
            </div>
          </div>
        </TinderCard>
        {/* Action Buttons */}
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
          <button onClick={swipeLeft} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Dislike
          </button>
          <button onClick={swipeRight} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
            Like
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColabHomepage;
