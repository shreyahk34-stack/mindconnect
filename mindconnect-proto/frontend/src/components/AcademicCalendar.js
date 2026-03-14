import React, { useState, useEffect } from 'react';

const AcademicCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    type: 'study',
    priority: 'medium',
    estimatedTime: 60,
    moodSuitable: true
  });

  // Load mood data and tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('academicTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedMood = localStorage.getItem('moodHistory');
    if (savedMood) {
      const moodHistory = JSON.parse(savedMood);
      if (moodHistory.length > 0) {
        const today = new Date().toDateString();
        const todayMood = moodHistory.find(entry => 
          new Date(entry.timestamp).toDateString() === today
        );
        if (todayMood) {
          setCurrentMood(todayMood.mood);
        }
      }
    }
  }, []);

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('academicTasks', JSON.stringify(tasks));
  }, [tasks]);

  const taskTypes = [
    { value: 'study', label: '📚 Study Session', icon: '📚' },
    { value: 'assignment', label: '📝 Assignment', icon: '📝' },
    { value: 'exam', label: '📋 Exam', icon: '📋' },
    { value: 'project', label: '💼 Project', icon: '💼' },
    { value: 'reading', label: '📖 Reading', icon: '📖' },
    { value: 'review', label: '🔄 Review', icon: '🔄' },
    { value: 'break', label: '☕ Break', icon: '☕' },
    { value: 'exercise', label: '🏃 Exercise', icon: '🏃' }
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: '#4CAF50' },
    { value: 'medium', label: 'Medium', color: '#FF9800' },
    { value: 'high', label: 'High', color: '#F44336' },
    { value: 'urgent', label: 'Urgent', color: '#9C27B0' }
  ];

  // Mood-based task suggestions
  const getMoodBasedSuggestions = (mood) => {
    const suggestions = {
      happy: {
        tasks: ['Complex problem solving', 'Creative projects', 'Group study', 'New topics'],
        methods: ['Active learning', 'Discussion groups', 'Teaching others'],
        duration: 'Longer sessions (2-3 hours)',
        breaks: 'Every 45-60 minutes'
      },
      calm: {
        tasks: ['Reading assignments', 'Note-taking', 'Review sessions', 'Planning'],
        methods: ['Focused study', 'Mind mapping', 'Summarization'],
        duration: 'Moderate sessions (1-2 hours)',
        breaks: 'Every 30-45 minutes'
      },
      neutral: {
        tasks: ['Regular coursework', 'Practice problems', 'Research', 'Organizing'],
        methods: ['Standard study methods', 'Pomodoro technique'],
        duration: 'Standard sessions (1 hour)',
        breaks: 'Every 25-30 minutes'
      },
      sad: {
        tasks: ['Light reading', 'Review notes', 'Simple tasks', 'Self-care'],
        methods: ['Gentle approach', 'Short sessions', 'Positive reinforcement'],
        duration: 'Short sessions (20-30 minutes)',
        breaks: 'Frequent breaks'
      },
      anxious: {
        tasks: ['Familiar topics', 'Review material', 'Organizing', 'Breathing exercises'],
        methods: ['Structured approach', 'Step-by-step', 'Mindfulness'],
        duration: 'Very short sessions (15-20 minutes)',
        breaks: 'Every 15-20 minutes'
      },
      depressed: {
        tasks: ['Minimal tasks', 'Self-care', 'Light activities', 'Support seeking'],
        methods: ['Compassionate approach', 'Tiny steps', 'Celebrate small wins'],
        duration: 'Micro sessions (10-15 minutes)',
        breaks: 'As needed'
      }
    };
    return suggestions[mood?.value] || suggestions.neutral;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;

    const task = {
      id: Date.now(),
      ...newTask,
      date: selectedDate.toISOString(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    setTasks([...tasks, task]);
    setNewTask({
      title: '',
      description: '',
      type: 'study',
      priority: 'medium',
      estimatedTime: 60,
      moodSuitable: true
    });
    setShowTaskForm(false);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isToday = (date) => {
    if (!date) return false;
    return date.toDateString() === new Date().toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const moodSuggestions = currentMood ? getMoodBasedSuggestions(currentMood) : null;
  const selectedDateTasks = getTasksForDate(selectedDate);

  return (
    <div className="academic-calendar">
      <div className="calendar-header">
        <h3>📅 Academic Calendar Planner</h3>
        {currentMood && (
          <div className="mood-indicator">
            <span className="mood-emoji">{currentMood.emoji}</span>
            <span className="mood-label">Today's Mood: {currentMood.label}</span>
          </div>
        )}
      </div>

      {moodSuggestions && (
        <div className="mood-suggestions">
          <h4>💡 Mood-Based Study Suggestions</h4>
          <div className="suggestions-grid">
            <div className="suggestion-item">
              <span className="suggestion-icon">📚</span>
              <div>
                <strong>Recommended Tasks:</strong>
                <p>{moodSuggestions.tasks.join(', ')}</p>
              </div>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">🎯</span>
              <div>
                <strong>Study Methods:</strong>
                <p>{moodSuggestions.methods.join(', ')}</p>
              </div>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">⏰</span>
              <div>
                <strong>Session Duration:</strong>
                <p>{moodSuggestions.duration}</p>
              </div>
            </div>
            <div className="suggestion-item">
              <span className="suggestion-icon">☕</span>
              <div>
                <strong>Break Schedule:</strong>
                <p>{moodSuggestions.breaks}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="calendar-container">
        <div className="calendar-nav">
          <button onClick={() => navigateMonth(-1)} className="nav-btn">←</button>
          <h4>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
          <button onClick={() => navigateMonth(1)} className="nav-btn">→</button>
        </div>

        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-days">
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayTasks = getTasksForDate(date);
              const hasTasks = dayTasks.length > 0;
              const completedTasks = dayTasks.filter(task => task.completed).length;
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${!date ? 'empty' : ''} ${isToday(date) ? 'today' : ''} ${isSelected(date) ? 'selected' : ''} ${hasTasks ? 'has-tasks' : ''}`}
                  onClick={() => date && setSelectedDate(date)}
                >
                  {date && (
                    <>
                      <span className="day-number">{date.getDate()}</span>
                      {hasTasks && (
                        <div className="task-indicator">
                          <span className="task-count">{dayTasks.length}</span>
                          {completedTasks > 0 && (
                            <span className="completed-count">✓{completedTasks}</span>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="task-section">
        <div className="task-header">
          <h4>📋 Tasks for {selectedDate.toLocaleDateString()}</h4>
          <button 
            className="add-task-btn"
            onClick={() => setShowTaskForm(!showTaskForm)}
          >
            + Add Task
          </button>
        </div>

        {showTaskForm && (
          <div className="task-form">
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                className="task-input"
              />
            </div>
            <div className="form-row">
              <textarea
                placeholder="Task description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                className="task-textarea"
                rows="3"
              />
            </div>
            <div className="form-row">
              <select
                value={newTask.type}
                onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                className="task-select"
              >
                {taskTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="task-select"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label} Priority
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <input
                type="number"
                placeholder="Estimated time (minutes)"
                value={newTask.estimatedTime}
                onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 60})}
                className="task-input"
                min="5"
                max="480"
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={newTask.moodSuitable}
                  onChange={(e) => setNewTask({...newTask, moodSuitable: e.target.checked})}
                />
                Suitable for current mood
              </label>
            </div>
            <div className="form-actions">
              <button onClick={addTask} className="save-task-btn">Save Task</button>
              <button onClick={() => setShowTaskForm(false)} className="cancel-btn">Cancel</button>
            </div>
          </div>
        )}

        <div className="task-list">
          {selectedDateTasks.length === 0 ? (
            <div className="no-tasks">
              <p>No tasks scheduled for this date. Add a task to get started! 📝</p>
            </div>
          ) : (
            selectedDateTasks.map(task => {
              const taskType = taskTypes.find(t => t.value === task.type);
              const priority = priorities.find(p => p.value === task.priority);
              
              return (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <div className="task-main">
                    <div className="task-checkbox">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskCompletion(task.id)}
                      />
                    </div>
                    <div className="task-content">
                      <div className="task-header-info">
                        <span className="task-type-icon">{taskType?.icon}</span>
                        <h5 className="task-title">{task.title}</h5>
                        <span 
                          className="task-priority"
                          style={{ backgroundColor: priority?.color }}
                        >
                          {priority?.label}
                        </span>
                      </div>
                      {task.description && (
                        <p className="task-description">{task.description}</p>
                      )}
                      <div className="task-meta">
                        <span className="task-time">⏱️ {task.estimatedTime} min</span>
                        {task.moodSuitable && (
                          <span className="mood-suitable">😊 Mood-friendly</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    className="delete-task-btn"
                    onClick={() => deleteTask(task.id)}
                  >
                    🗑️
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;




