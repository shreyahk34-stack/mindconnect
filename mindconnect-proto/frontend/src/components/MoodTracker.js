import React, { useState, useEffect } from 'react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [note, setNote] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [weeklyAnalysis, setWeeklyAnalysis] = useState(null);

  const moods = [
    { emoji: '😊', label: 'Happy', value: 5, color: '#FFD700' },
    { emoji: '😌', label: 'Calm', value: 4, color: '#87CEEB' },
    { emoji: '😐', label: 'Neutral', value: 3, color: '#D3D3D3' },
    { emoji: '😔', label: 'Sad', value: 2, color: '#4682B4' },
    { emoji: '😰', label: 'Anxious', value: 1, color: '#FF6347' },
    { emoji: '😢', label: 'Depressed', value: 0, color: '#8B0000' }
  ];

  useEffect(() => {
    // Load mood history from localStorage
    const savedHistory = localStorage.getItem('moodHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setMoodHistory(parsed);
      setWeeklyAnalysis(getWeeklyAnalysis(parsed));
    }
  }, []);

  const getRecommendationForMood = (mood, noteText) => {
    if (!mood) return null;
    const base = {
      title: '',
      actions: [],
      warning: null,
    };

    const label = mood.label.toLowerCase();

    if (label === 'happy' || label === 'calm') {
      return {
        ...base,
        title: 'You seem to be in a good space today 💛',
        actions: [
          'Use this energy for focused study or project work',
          'Schedule 1–2 longer deep‑work blocks in the Academic Planner',
          'Do one small act of kindness for yourself or a friend',
        ],
      };
    }

    if (label === 'neutral') {
      return {
        ...base,
        title: 'You are feeling neutral today 😐',
        actions: [
          'Plan short, clear tasks (25–30 minutes) instead of long sessions',
          'Start with easy wins (review notes, organize your to‑do list)',
          'Add 1 short break and 1 enjoyable activity to your day',
        ],
      };
    }

    if (label === 'sad') {
      return {
        ...base,
        title: 'You marked feeling sad today 💙',
        actions: [
          'Keep academic tasks light (reading, review, simple exercises)',
          'Schedule at least one self‑care block (walk, music, journaling)',
          'Avoid overloading your timetable in the Academic Planner',
        ],
        warning:
          'If this feeling has been present for many days in a row, consider talking to a trusted adult or counselor.',
      };
    }

    if (label === 'anxious') {
      return {
        ...base,
        title: 'You are feeling anxious today 😰',
        actions: [
          'Break work into very small, clear steps (10–20 minutes)',
          'Add breathing or grounding exercises before/after study blocks',
          'Prioritize familiar topics instead of new, complex material',
        ],
        warning:
          'If anxiety is stopping you from doing daily activities, it may help to reach out for professional support.',
      };
    }

    if (label === 'depressed') {
      return {
        ...base,
        title: 'You marked feeling very low today 💔',
        actions: [
          'Keep expectations very small — one tiny academic task is enough',
          'Add several self‑care breaks and activities that feel safe/comforting',
          'Use the Academic Planner to block time for rest, not just work',
        ],
        warning:
          'If you feel hopeless, think about self‑harm, or this mood lasts for weeks, please seek immediate help or use the Emergency option in the app.',
      };
    }

    return {
      ...base,
      title: 'Thank you for checking in today',
      actions: [
        'Use the Academic Planner to create 1–3 realistic tasks for today',
        'Add at least one activity that supports your mental health',
      ],
    };
  };

  const getWeeklyAnalysis = (history) => {
    if (!history || history.length === 0) return null;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const lastWeek = history.filter((entry) => {
      const t = new Date(entry.timestamp);
      return t >= sevenDaysAgo && t <= now;
    });

    if (lastWeek.length === 0) return null;

    const avg =
      lastWeek.reduce((sum, e) => sum + (e.mood?.value ?? 0), 0) /
      lastWeek.length;

    const counts = lastWeek.reduce(
      (acc, e) => {
        const label = (e.mood?.label || '').toLowerCase();
        if (label === 'happy' || label === 'calm') acc.positive += 1;
        else if (label === 'neutral') acc.neutral += 1;
        else acc.negative += 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    let riskLevel = 'balanced';
    let message =
      'Your mood has been mixed this week. Try to keep checking in and balancing work with rest.';

    if (avg >= 4) {
      riskLevel = 'thriving';
      message =
        'Overall your mood looks strong. This is a good time to build healthy study routines and habits.';
    } else if (avg <= 2) {
      riskLevel = 'concerning';
      message =
        'Your average mood has been low. It might help to talk to someone you trust or a counselor, especially if this continues.';
    } else if (counts.negative > counts.positive) {
      riskLevel = 'watching';
      message =
        'There have been more low‑mood days than high‑mood days. Keep an eye on this trend and add extra self‑care and support.';
    }

    return {
      average: avg.toFixed(1),
      totalDays: lastWeek.length,
      counts,
      riskLevel,
      message,
    };
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setRecommendation(getRecommendationForMood(mood, note));
  };

  const saveMood = () => {
    if (!selectedMood) return;

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      note: note,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    const updatedHistory = [newEntry, ...moodHistory.slice(0, 20)]; // keep recent history
    setMoodHistory(updatedHistory);
    localStorage.setItem('moodHistory', JSON.stringify(updatedHistory));
    setWeeklyAnalysis(getWeeklyAnalysis(updatedHistory));
    
    // Reset form
    setSelectedMood(null);
    setNote('');
    
    // Show success message
    alert('Mood saved successfully! 🌟');
  };

  const getMoodStreak = () => {
    if (moodHistory.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    for (let i = 0; i < moodHistory.length; i++) {
      const entryDate = new Date(moodHistory[i].timestamp).toDateString();
      if (entryDate === today || (streak === 0 && entryDate === yesterday)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getAverageMood = () => {
    if (moodHistory.length === 0) return 0;
    const total = moodHistory.reduce((sum, entry) => sum + entry.mood.value, 0);
    return (total / moodHistory.length).toFixed(1);
  };

  return (
    <div className="mood-tracker">
      <div className="mood-header">
        <h3>How are you feeling today? 😊</h3>
        <div className="mood-stats">
          <div className="stat">
            <span className="stat-number">{getMoodStreak()}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat">
            <span className="stat-number">{getAverageMood()}</span>
            <span className="stat-label">Avg Mood</span>
          </div>
        </div>
      </div>

      <div className="mood-selector">
        {moods.map((mood) => (
          <button
            key={mood.value}
            className={`mood-option ${selectedMood?.value === mood.value ? 'selected' : ''}`}
            onClick={() => handleMoodSelect(mood)}
            style={{ 
              backgroundColor: selectedMood?.value === mood.value ? mood.color : '#f8f9fa',
              borderColor: mood.color
            }}
          >
            <span className="mood-emoji">{mood.emoji}</span>
            <span className="mood-label">{mood.label}</span>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-note">
          <textarea
            placeholder="Add a note about your mood (optional)..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows="3"
          />
          <button className="save-mood-btn" onClick={saveMood}>
            Save Mood ✨
          </button>
        </div>
      )}

      {recommendation && (
        <div className="mood-recommendation card">
          <h4>Personalized guidance for today</h4>
          <p className="mood-recommendation-title">{recommendation.title}</p>
          <ul className="mood-recommendation-list">
            {recommendation.actions.map((action, idx) => (
              <li key={idx}>{action}</li>
            ))}
          </ul>
          {recommendation.warning && (
            <p className="mood-recommendation-warning">
              {recommendation.warning}
            </p>
          )}
          <p className="mood-recommendation-hint">
            Tip: Open the Academic Planner to schedule tasks that match this
            guidance.
          </p>
        </div>
      )}

      {moodHistory.length > 0 && (
        <div className="mood-history">
          <h4>Recent Mood History</h4>
          <div className="history-list">
            {moodHistory.slice(0, 5).map((entry) => (
              <div key={entry.id} className="history-item">
                <span className="history-emoji">{entry.mood.emoji}</span>
                <div className="history-details">
                  <span className="history-mood">{entry.mood.label}</span>
                  <span className="history-date">{entry.date}</span>
                  {entry.note && <p className="history-note">{entry.note}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weeklyAnalysis && (
        <div className="mood-weekly card">
          <h4>🧠 Weekly Mood Insight (last 7 days)</h4>
          <p className="weekly-summary">
            Average mood: <strong>{weeklyAnalysis.average}</strong> • Days
            tracked: <strong>{weeklyAnalysis.totalDays}</strong>
          </p>
          <p className="weekly-breakdown">
            Positive days: {weeklyAnalysis.counts.positive} • Neutral days:{' '}
            {weeklyAnalysis.counts.neutral} • Low‑mood days:{' '}
            {weeklyAnalysis.counts.negative}
          </p>
          <p className="weekly-message">{weeklyAnalysis.message}</p>
          {weeklyAnalysis.riskLevel !== 'thriving' && (
            <p className="weekly-note">
              If you are worried about how you feel, consider using the
              Chatbot, talking to a counselor, or reaching out to someone you
              trust.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MoodTracker;




