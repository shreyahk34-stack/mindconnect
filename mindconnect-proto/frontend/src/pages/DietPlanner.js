import React from 'react';
import DietPlanner from '../components/DietPlanner';

export default function DietPlannerPage() {
  return (
    <div className="container">
      <div className="page-title">🥗 Diet Planner</div>
      <p
        style={{
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.85)',
          fontSize: '1.1rem',
          maxWidth: '800px',
          margin: '0 auto 25px auto',
        }}
      >
        Your food choices can support your mood, focus and energy. This planner suggests a simple
        daily eating pattern based on how you felt in your latest mood check‑in.
      </p>
      <DietPlanner />
    </div>
  );
}




