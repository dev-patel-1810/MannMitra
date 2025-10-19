import { useTranslation } from 'react-i18next';
import './CalmingMusic.css';
import React, { useState } from 'react';

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
      category: 'piano'
    },
    {
      title: 'Ocean Waves',
      url: 'https://www.youtube.com/embed/bn9F19Hi1Lk',
      description: 'Soothing ocean waves for stress relief',
      category: 'ocean'
    },
  ];

  const [category, setCategory] = useState('all');

  return (
    <div className="resources-container">
        <div className="page-header">
            <div className='calming-description'>
                <h1>{t('dashboard.calming_music')}</h1>
                <p className="subtitle">Harmony for Your Heart, Calm for Your Mind</p>
            </div>
            <img className="calming-img" src={heroImage} alt="image" />
        </div>
    
        <div className="filter-tabs">
            <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All</button>
            <button className={category === 'nature' ? 'active' : ''} onClick={() => setCategory('nature')}>Nature</button>
            <button className={category === 'ocean' ? 'active' : ''} onClick={() => setCategory('ocean')}>Ocean</button>
        </div>
    
        <div className="music-grid">
        {tracks
            .filter(track => category === 'all' || track.category === category)
            .map((track, index) => (
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
            ))}
        </div>
    </div>
  
  );
};

export default CalmingMusic;