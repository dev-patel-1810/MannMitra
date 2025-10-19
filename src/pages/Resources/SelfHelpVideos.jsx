import { useTranslation } from 'react-i18next';
import './SelfHelpVideos.css';
import React, { useState } from 'react';

import herooImage from '../../assets/hero.png'; 

const SelfHelpVideos = () => {
  const { t } = useTranslation();

  const videos = [
    {
      title: 'Guided Meditation for Beginners',
      url: 'https://www.youtube.com/embed/inpok4MKVLM',
      description: 'A 10-minute guided meditation for stress relief',
      category: 'meditation'
    },
    {
      title: 'Breathing Exercises',
      url: 'https://www.youtube.com/embed/acUZdGd_3Dg',
      description: 'Simple breathing techniques for anxiety management',
      category:'breathing'
    },
    {
      title: 'Mindfulness Practice',
      url: 'https://www.youtube.com/embed/ZToicYcHIOU',
      description: 'Learn basic mindfulness techniques',
      category:'mindfulness'
    }
  ];

  const [category, setCategory] = useState('all');

  return (
    <div className="resources-container">
      <div className="page-headerr">
        <div className='self-description'>
            <h1>{t('dashboard.self_help_videos')}</h1>
            <p className="subtitle">Small Steps Today, Big Wins Tomorrow</p>
        </div>
        <img className="self-img" src={herooImage} alt="image" />
      </div>

      <div className="filter-tabss">
        <button className={category === 'all' ? 'active' : ''} onClick={() => setCategory('all')}>All</button>
        <button className={category === 'meditation' ? 'active' : ''} onClick={() => setCategory('meditation')}>Meditation</button>
        <button className={category === 'breathing' ? 'active' : ''} onClick={() => setCategory('breathing')}>Breathing</button>
        <button className={category === 'mindfulness' ? 'active' : ''} onClick={() => setCategory('mindfulness')}>Mindfulness</button>
      </div>

      <div className="video-grid">
        {videos
        .filter(track => category === 'all' || track.category === category)
        .map((video, index) => (
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
            <p>{video.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelfHelpVideos;