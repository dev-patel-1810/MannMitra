import { useTranslation } from 'react-i18next';
import './SelfHelpVideos.css';
import React, { useState } from 'react';

import herooImage from '../../assets/Resource_Img.png'; 

const SelfHelpVideos = () => {
  const { t } = useTranslation();

  const videos = [
    {
      title: '5-Minute Meditation You Can Do Anywhere',
      url: 'https://www.youtube.com/embed/inpok4MKVLM',
      description: 'A quick reset for your day with calming guidance',
      category: 'meditation'
    },
    {
      title: 'Guided Meditation – Blissful Deep Relaxation',
      url: 'https://www.youtube.com/embed/Jyy0ra2WcQQ',
      description: 'A gentle journey into deep relaxation to settle your mind',
      category: 'meditation'
    },
    {
      title: '10 MIN Guided Meditation To Clear Your Mind & Start New',
      url: 'https://www.youtube.com/embed/uTN29kj7e-w',
      description: 'A 10-minute session to clear your mind and reset your day',
      category: 'meditation'
    },
    {
      title: '4-7-8 Calm Breathing Exercise | 10 Minutes of Deep Relaxation',
      url: 'https://www.youtube.com/embed/LiUnFJ8P4gM',
      description: 'A deep relaxation technique to calm your mind and make your life joyful',
      category: 'breathing'
    },
    {
      title: 'Box Breathing Relaxation Technique: How to Calm Feelings of Anxiety',
      url: 'https://www.youtube.com/embed/tEmt1Znux58',
      description: 'A simple 5-minute exercise to reduce anxiety and stress',
      category: 'breathing'
    },
    {
      title: 'Mindful Breathing Exercise To get you Calm',
      url: 'https://www.youtube.com/embed/wfDTp2GogaQ',
      description: 'A short exercise to help you feel more calm and centered',
      category: 'breathing'
    },
    {
      title: '5-Minute Mindfulness Meditation for a Beautiful Mind',
      url: 'https://www.youtube.com/embed/ssss7V1_eyA',
      description: 'A brief session to practice mindfulness and be at peace',
      category: 'mindfulness'
    },
    {
      title: 'Guided Mindfulness Meditations Playlist to Balance Your Mind',
      url: 'https://www.youtube.com/embed/videoseries?list=PL7by6RYPG3HDE8kJe2DXiS3M_yTzCGJz6',
      description: 'A collection of guided mindfulness sessions',
      category: 'mindfulness'
    },
    {
      title: '20 Minute Mindfulness Meditation for Being Present',
      url: 'https://www.youtube.com/embed/-2zdUXve6fQ',
      description: 'A longer session to deepen your mindfulness practice',
      category: 'mindfulness'
    }
  ];

  // 🔹 State Management
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState(() => {
    // Load favorites from localStorage initially
    const saved = localStorage.getItem('videoFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 Add or Remove Favorite
  const toggleFavorite = (video) => {
    let updatedFavorites;
    if (favorites.some((fav) => fav.url === video.url)) {
      updatedFavorites = favorites.filter((fav) => fav.url !== video.url);
    } else {
      updatedFavorites = [...favorites, video];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('videoFavorites', JSON.stringify(updatedFavorites));

    // e.currentTarget.blur();
  };

  // 🔹 Filtering logic (category + favorites + search)
  const filteredVideos = videos
    .filter(
      (video) =>
        category === 'all' ||
        video.category === category ||
        (category === 'favorites' &&
          favorites.some((fav) => fav.url === video.url))
    )
    .filter(
      (video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="resources-container">
      {/* Header Section */}
      <div className="page-headerr">
        <div className="self-description">
          <h1>{t('dashboard.self_help_videos')}</h1>
          <p className="subtitle">Small steps today, big wins tomorrow — explore guided videos to manage stress, practice mindfulness, and improve your mental wellbeing.</p>
        </div>
        <img className="self-img" src={herooImage} alt="Self help banner" />
      </div>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabss">
        <button
          className={category === 'all' ? 'active' : ''}
          onClick={() => setCategory('all')}
        >
          All
        </button>
        <button
          className={category === 'meditation' ? 'active' : ''}
          onClick={() => setCategory('meditation')}
        >
          Meditation
        </button>
        <button
          className={category === 'breathing' ? 'active' : ''}
          onClick={() => setCategory('breathing')}
        >
          Breathing
        </button>
        <button
          className={category === 'mindfulness' ? 'active' : ''}
          onClick={() => setCategory('mindfulness')}
        >
          Mindfulness
        </button>
        <button
          className={category === 'favorites' ? 'active' : ''}
          onClick={() => setCategory('favorites')}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => (
            <div key={index} className="video-card">
              <iframe
                width="100%"
                height="200"
                src={video.url}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <h3>{video.title}</h3>
              <div className="calm-content">
                <p>{video.description}</p>
                  <button
                    className={`favorite-btn ${favorites.some(fav => fav.url === video.url) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(video)}
                  >
                    {favorites.some(fav => fav.url === video.url) ? <img width="36" height="36" src="https://img.icons8.com/color/48/hearts.png" alt="hearts"/> :<img width="36" height="36" src="https://img.icons8.com/metro/26/like.png" alt="like"/>}
                  </button>
              </div>
              
            </div>
          ))
        ) : (
          <p className="no-results">No videos match your search.</p>
        )}
      </div>
    </div>
  );
};

export default SelfHelpVideos;
