import React from 'react';
import { Text } from 'react-native';
import '../assets/ProjectSelection.css'; // Import the CSS file

export default function ProjectSelection() {
  return (
    <div className="project-cards-container">
      {/* Card 1 */}
      <div className="project-card card-1">
        <Text className="card-title">Ali's Milestones</Text>
        <Text className="card-description">
         Ali's anazing milestones
        </Text>
      </div>

      {/* Card 2 */}
      <div className="project-card card-2">
        <Text className="card-title">Nika's Milestones</Text>
        <Text className="card-description">
          Nika's amazing milestones
        </Text>
      </div>

      {/* Card 3 */}
      <div className="project-card card-3">
        <Text className="card-title">Our MVP</Text>
        <Text className="card-description">
          Our great Minimum Viable Product.
        </Text>
      </div>
    </div>
  );
}
