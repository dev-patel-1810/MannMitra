import React from 'react';
import Card from '../Card/Card';
import './Features.css';

const Features = () => {
  const featuresData = [
    { title: "Connect with Therapists", description: "Chat with professional therapists easily through our app." },
    { title: "Track Your Mood", description: "Daily check-ins to monitor and improve your mental health." },
    { title: "Community Support", description: "Join groups and share experiences with peers." },
    { title: "Guided Exercises", description: "Access meditation and wellness exercises anytime." },
  ];

  return (
    <section className="features">
      {featuresData.map((feature, index) => (
        <Card
          key={index}
          title={feature.title}
          description={feature.description}
        />
      ))}
    </section>
  );
};

export default Features;
