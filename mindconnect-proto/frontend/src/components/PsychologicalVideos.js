import React, { useState } from 'react';

const PsychologicalVideos = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const videoCategories = [
    { id: 'all', name: 'All Videos', icon: '🎥' },
    { id: 'anxiety', name: 'Anxiety & Stress', icon: '🧘' },
    { id: 'depression', name: 'Depression', icon: '💙' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🌸' },
    { id: 'motivation', name: 'Motivation', icon: '💪' },
    { id: 'sleep', name: 'Sleep & Relaxation', icon: '😴' }
  ];

  const videos = [
    {
      id: 1,
      title: 'Understanding Anxiety: A Complete Guide',
      description: 'Learn about anxiety disorders, symptoms, and coping strategies',
      duration: '12:30',
      category: 'anxiety',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '2.3M',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Mindfulness Meditation for Beginners',
      description: 'Start your mindfulness journey with this guided meditation',
      duration: '15:45',
      category: 'mindfulness',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '1.8M',
      rating: 4.9
    },
    {
      id: 3,
      title: 'Overcoming Depression: Hope and Healing',
      description: 'Evidence-based strategies for managing depression',
      duration: '18:20',
      category: 'depression',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '3.1M',
      rating: 4.7
    },
    {
      id: 4,
      title: 'Daily Motivation: Building Resilience',
      description: 'Tips for staying motivated and building mental resilience',
      duration: '10:15',
      category: 'motivation',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '1.5M',
      rating: 4.6
    },
    {
      id: 5,
      title: 'Deep Sleep Meditation',
      description: 'Relaxing meditation to help you fall asleep faster',
      duration: '25:00',
      category: 'sleep',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '4.2M',
      rating: 4.9
    },
    {
      id: 6,
      title: 'Stress Management Techniques',
      description: 'Practical techniques to manage and reduce stress',
      duration: '14:30',
      category: 'anxiety',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      views: '2.7M',
      rating: 4.8
    }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const openVideo = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="psychological-videos">
      <div className="videos-header">
        <h3>🧠 Psychological Support Videos</h3>
        <p>Expert-led content to support your mental health journey</p>
      </div>

      <div className="video-categories">
        {videoCategories.map((category) => (
          <button
            key={category.id}
            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </button>
        ))}
      </div>

      <div className="videos-grid">
        {filteredVideos.map((video) => (
          <div key={video.id} className="video-card" onClick={() => openVideo(video.url)}>
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt={video.title} />
              <div className="play-overlay">
                <span className="play-icon">▶️</span>
              </div>
              <div className="video-duration">{video.duration}</div>
            </div>
            <div className="video-info">
              <h4 className="video-title">{video.title}</h4>
              <p className="video-description">{video.description}</p>
              <div className="video-meta">
                <span className="video-views">👁️ {video.views} views</span>
                <span className="video-rating">⭐ {video.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="no-videos">
          <p>No videos found in this category. Try selecting a different category.</p>
        </div>
      )}
    </div>
  );
};

export default PsychologicalVideos;




