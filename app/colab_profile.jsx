import React from 'react';

// Simple Navbar Component
function Navbar() {
  return (
    <div
      style={{
        width: '100%',
        backgroundColor: '#1a1a2e',
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

function Logo() {
  const logoImageUrl = "https://i.pinimg.com/736x/2e/ba/09/2eba09d8aaafc680b8eef0078921241a.jpg";  // Your image URL

  return (
    <div style={{
      position: 'absolute',
      top: '5rem', // Adjust this to move it down
      left: '50%',
      transform: 'translateX(-700%)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 10, 
    }}>
      <img src={logoImageUrl} alt="Logo" style={{ height: '80px' }} />
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
      <Logo />

      {/* Profile Card Container */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '2rem'
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            width: '400px',
            backgroundColor: '#AEC391',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 0 10px rgba(20, 17, 17, 0.2)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2 style={{ marginBottom: '1rem', color: '#232323' }}>{userProfile.userSchoolName}</h2>
          <p style={{ marginBottom: '0.5rem', color: '#232323' }}>
            <strong>Nationality:</strong> {userProfile.isIsraeli ? "Israeli" : "Palestinian"}
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#232323' }}>
            <strong>Location:</strong> {userProfile.userLocation}
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#232323' }}>
            <strong>Special Programs:</strong> {userProfile.specialPrograms}
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#232323' }}>
            <strong>Age Groups:</strong> {userProfile.ageGroups}
          </p>
          <p style={{ marginBottom: '0.5rem', color: '#232323' }}>
            <strong>Language Focus:</strong> {userProfile.languageFocus}
          </p>
        </div>
      </div>

      {/* Edit Button under the Profile Card */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem'
        }}
      >
        <button
          style={{
            backgroundColor: '#64adc3',
            color: 'white',
            padding: '0.5rem 1rem',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
          onClick={() => console.log("Edit Profile pressed")}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
}

export default ColabProfile;
