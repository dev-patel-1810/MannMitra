import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './CalmingMusic.css';

import heroImage from '../../assets/hero.png'; 

const CalmingMusic = () => {
  const { t } = useTranslation();

  const tracks = [
  {
    title: 'Peaceful Nature Sounds',
    url: 'https://www.youtube.com/embed/eKFTSSKCzWA',
    description: 'Relaxing nature sounds for meditation',
    category: 'nature'
  },
  {
    title: 'Calming Piano Music',
    url: 'https://www.youtube.com/embed/77ZozI0rw7w',
    description: 'Soft piano melodies for relaxation',
    category: 'instrumental'
  },
  {
    title: 'Ocean Waves',
    url: 'https://www.youtube.com/embed/bn9F19Hi1Lk',
    description: 'Soothing ocean waves for stress relief',
    category: 'nature'
  },
  {
    title: 'Gentle Guitar Melodies',
    url: 'https://www.youtube.com/embed/2OEL4P1Rz04',
    description: 'Acoustic guitar tunes that calm the soul',
    category: 'instrumental'
  },
  {
    title: 'Focus & Study Music',
    url: 'https://www.youtube.com/embed/lFcSrYw-ARY',
    description: 'Lo-fi chill beats for focus, relaxation, or study sessions',
    category: 'focus'
  },
  {
    title: 'Relaxing Flute Music | Calmness',
    url: 'https://www.youtube.com/embed/GN5q747x1zI',
    description: 'Gentle flute instrumental for sleep and self-healing',
    category: 'instrumental'
  },
  {
    title: 'Flute Music | Healing Waves',
    url: 'https://www.youtube.com/embed/UX9WBLHqfZM',
    description: 'Calming flute music for meditation and deep peace',
    category: 'instrumental'
  },
  {
    title: 'Soothing Flute Music for Meditation',
    url: 'https://www.youtube.com/embed/chiCFVtH-xw',
    description: 'Flute and ambient nature sounds for relaxation, spa, yoga',
    category: 'instrumental'
  }
];


  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter tracks by category + search term
  const filteredTracks = tracks
    .filter(track => category === 'all' || track.category === category)
    .filter(track =>
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="resources-container">
      {/* Header Section */}
      <div className="page-header">
        <div className='calming-description'>
          <h1>{t('dashboard.calming_music')}</h1>
          <p className="subtitle">Harmony for Your Heart, Calm for Your Mind</p>
        </div>
        <img className="calming-img" src={heroImage} alt="image" />
      </div>

      {/* 🔍 Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for music..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filter Buttons */}
      <div className="filter-tabs">
        <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All</button>
        <button className={category === 'nature' ? 'active' : ''} onClick={() => setCategory('nature')}>Nature</button>
        <button className={category === 'instrumental' ? 'active' : ''} onClick={() => setCategory('instrumental')}>Instrumental</button>
        <button className={category === 'focus' ? 'active' : ''} onClick={() => setCategory('focus')}>Focus</button>
      </div>

      {/* Music Cards */}
      <div className="music-grid">
        {filteredTracks.length > 0 ? (
          filteredTracks.map((track, index) => (
            <div key={index} className="music-card">
              <iframe
                width="100%"
                height="200"
                src={track.url}
                title={track.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <h3>{track.title}</h3>
              <p>{track.description}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No tracks match your search.</p>
        )}
      </div>
    </div>
  );
};

export default CalmingMusic;
