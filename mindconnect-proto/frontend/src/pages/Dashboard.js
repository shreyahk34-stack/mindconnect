import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { history } from '../api';
import MoodTracker from '../components/MoodTracker';
import PsychologicalVideos from '../components/PsychologicalVideos';
import DietPlanner from '../components/DietPlanner';

export default function Dashboard(){
  const [h, setH] = useState([]);
  const [points, setPoints] = useState(120); // demo points
  const [streak, setStreak] = useState(7); // demo streak
  
  useEffect(()=>{ history().then(d=>setH(d||[])); },[]);

  const achievements = [
    { icon: '🎯', title: 'First Screening', description: 'Complete your first mental health screening', earned: true },
    { icon: '📊', title: 'Weekly Tracker', description: 'Track your mood for 7 consecutive days', earned: true },
    { icon: '🧘', title: 'Mindfulness Master', description: 'Complete 10 mindfulness sessions', earned: false },
    { icon: '💪', title: 'Resilience Builder', description: 'Earn 500 points through activities', earned: false }
  ];

  return (
    <div className="container">
      <div className="page-title">🌟 Your Mental Health Dashboard</div>
      
      {/* Stats Overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-content">
            <div className="stat-number">{points}</div>
            <div className="stat-label">Points Earned</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <div className="stat-number">{streak}</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{h.length}</div>
            <div className="stat-label">Screenings Done</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <div className="stat-number">{achievements.filter(a => a.earned).length}</div>
            <div className="stat-label">Achievements</div>
          </div>
        </div>
      </div>

      {/* Mood Tracker */}
      <MoodTracker />

      {/* Quick Actions */}
      <div className="card">
        <h3>🚀 Quick Actions</h3>
        <div className="quick-actions">
          <button className="action-btn" onClick={()=>setPoints(p=>p+10)}>
            <span className="action-icon">📝</span>
            <span className="action-text">Daily Check-in</span>
            <span className="action-points">+10 pts</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🧘</span>
            <span className="action-text">Mindfulness</span>
            <span className="action-points">+15 pts</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">📊</span>
            <span className="action-text">Take Screening</span>
            <span className="action-points">+20 pts</span>
          </button>
          <Link to="/diet" className="action-btn">
            <span className="action-icon">🥗</span>
            <span className="action-text">Diet Planner</span>
            <span className="action-points">+10 pts</span>
          </Link>
          <Link to="/planner" className="action-btn">
            <span className="action-icon">📚</span>
            <span className="action-text">Academic Planner</span>
            <span className="action-points">+15 pts</span>
          </Link>
          <button className="action-btn">
            <span className="action-icon">💬</span>
            <span className="action-text">Chat Support</span>
            <span className="action-points">+5 pts</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3>📊 Recent Activity</h3>
        {h.length > 0 ? (
          <div className="activity-list">
            {h.slice(0, 5).map(r => (
              <div key={r.id} className="activity-item">
                <div className="activity-icon">📋</div>
                <div className="activity-details">
                  <div className="activity-title">{r.type} Screening</div>
                  <div className="activity-meta">
                    Score: {r.score} ({r.category}) • {new Date(r.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="activity-points">+20 pts</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-activity">
            <p>No recent activity. Start by taking a screening or tracking your mood!</p>
          </div>
        )}
      </div>

      {/* Achievements */}
      <div className="card">
        <h3>🏆 Achievements</h3>
        <div className="achievements-grid">
          {achievements.map((achievement, index) => (
            <div key={index} className={`achievement-item ${achievement.earned ? 'earned' : 'locked'}`}>
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-content">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
              </div>
              {achievement.earned && <div className="achievement-badge">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Diet Planner preview */}
      <DietPlanner />

      {/* Psychological Videos */}
      <PsychologicalVideos />
    </div>
  );
}
