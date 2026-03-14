import React from 'react';
import AcademicCalendar from '../components/AcademicCalendar';

export default function AcademicPlanner() {
  return (
    <div className="container">
      <div className="page-title">📚 Academic Planner</div>
      <p style={{ 
        textAlign: 'center', 
        color: 'rgba(255, 255, 255, 0.8)', 
        fontSize: '1.1rem', 
        marginBottom: '30px',
        maxWidth: '800px',
        margin: '0 auto 30px auto'
      }}>
        Plan your academic journey with mood-based task suggestions. 
        Our intelligent system adapts to your emotional state to recommend the best study methods and activities.
      </p>
      <AcademicCalendar />
    </div>
  );
}




