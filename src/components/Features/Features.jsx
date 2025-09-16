
import React from 'react';
import './Features.css';
import wellnessTree from '../../assets/wellness_tree.png';
import bookCounsellor from '../../assets/book_counsellor.png';
import chatBuddy from '../../assets/chat_buddy.png';
import relaxZone from '../../assets/relax_zone.png';
import { useTranslation } from 'react-i18next';

const Features = () => {
  const { t } = useTranslation();
  const featuresData = [
    {
      title: t('features.wellnessTreeTitle'),
      description: t('features.wellnessTreeDesc'),
      image: wellnessTree,
      id: 'wellness-tree',
    },
    {
      title: t('features.bookCounsellorTitle'),
      description: t('features.bookCounsellorDesc'),
      image: bookCounsellor,
      id: 'book-counsellor',
    },
    {
      title: t('features.chatBuddyTitle'),
      description: t('features.chatBuddyDesc'),
      image: chatBuddy,
      id: 'chat-buddy',
    },
    {
      title: t('features.relaxZoneTitle'),
      description: t('features.relaxZoneDesc'),
      image: relaxZone,
      id: 'relax-zone',
    },
  ];

  return (
    <section className="features">
      <h2 className="features-title">{t('features.ourFeatures')}</h2>
      {featuresData.map((feature, index) => (
        <div key={index} className={`feature-item ${index % 2 === 0 ? 'image-left' : 'image-right'}`} id={feature.id}>
          <div className="feature-image-container">
            <img src={feature.image} alt={feature.title} className="feature-image" />
          </div>
          <div className="feature-content">
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default Features;
