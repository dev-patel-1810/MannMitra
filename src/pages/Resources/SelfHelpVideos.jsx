import React from 'react';
import { useTranslation } from 'react-i18next';
import './SelfHelpVideos.css';

const SelfHelpVideos = () => {
  const { t } = useTranslation();

  const videos = [
    {
      title: 'Guided Meditation for Beginners',
      url: 'https://www.youtube.com/embed/inpok4MKVLM',
      description: 'A 10-minute guided meditation for stress relief'
    },
    {
      title: 'Breathing Exercises',
      url: 'https://www.youtube.com/embed/acUZdGd_3Dg',
      description: 'Simple breathing techniques for anxiety management'
    },
    {
      title: 'Mindfulness Practice',
      url: 'https://www.youtube.com/embed/ZToicYcHIOU',
      description: 'Learn basic mindfulness techniques'
    }
  ];

  return (
    <div className="resources-container">
      <h1>{t('dashboard.self_help_videos')}</h1>
      <div className="video-grid">
        {videos.map((video, index) => (
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