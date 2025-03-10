import React from 'react';

// Simple Navbar Component
function Navbar() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#333',
        padding: '1rem',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
     <div style={{ display: 'flex' }}>
        <a href="/colab_homepage" style={{ margin: '0 1rem', color: '#f9f9f9ff', textDecoration: 'none' }}>
          Home
        </a>
        <a href="/colab_profile" style={{ margin: '0 1rem', color: '#f9f9f9ff', textDecoration: 'none' }}>
          Profile
        </a>
      </div>
    </div>
  );
}

// Profile Page Component
function ColabProfile() {
  // Dummy user profile data.
  const userProfile = {
    userSchoolName: "ABC International School",
    isIsraeli: true, // true: Israeli, false: Palestinian
    userLocation: "Tel Aviv, Israel",
    specialPrograms: "STEM, Arts, Language Exchange",
    ageGroups: "10-18",
    languageFocus: "English, Hebrew"
  };

  return (
    <div>
      {/* Navbar at the top */}
      <Navbar />

      {/* Profile Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem'
        }}
      >
        <div
          style={{
            width: '400px',
            backgroundColor: '#fff',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(0,0,0,0.2)'
          }}
        >
          <h2 style={{ marginBottom: '1rem' }}>{userProfile.userSchoolName}</h2>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Nationality:</strong> {userProfile.isIsraeli ? "Israeli" : "Palestinian"}
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Location:</strong> {userProfile.userLocation}
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Special Programs:</strong> {userProfile.specialPrograms}
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Age Groups:</strong> {userProfile.ageGroups}
          </p>
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Language Focus:</strong> {userProfile.languageFocus}
          </p>
          <button
            style={{
              backgroundColor: '#007BFF',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              marginTop: '1rem',
              cursor: 'pointer'
            }}
            onClick={() => console.log("Edit Profile pressed")}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}

export default ColabProfile;
