import React from 'react';
import { useTranslation } from 'react-i18next';
import './CalmingMusic.css';

const CalmingMusic = () => {
  const { t } = useTranslation();

  const tracks = [
    {
      title: 'Peaceful Nature Sounds',
      url: 'https://www.youtube.com/embed/eKFTSSKCzWA',
      description: 'Relaxing nature sounds for meditation'
    },
    {
      title: 'Calming Piano Music',
      url: 'https://www.youtube.com/embed/77ZozI0rw7w',
      description: 'Soft piano melodies for relaxation'
    },
    {
      title: 'Ocean Waves',
      url: 'https://www.youtube.com/embed/bn9F19Hi1Lk',
      description: 'Soothing ocean waves for stress relief'
    }
  ];

  return (
    <div className="resources-container">
      <h1>{t('dashboard.calming_music')}</h1>
      <div className="music-grid">
        {tracks.map((track, index) => (
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