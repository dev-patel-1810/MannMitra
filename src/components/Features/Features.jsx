import React from 'react';
import './Features.css';
// Import images
import wellnessTree from '../../assets/wellness_tree.png';
import bookCounsellor from '../../assets/book_counsellor.png';
import chatBuddy from '../../assets/chat_buddy.png';
import relaxZone from '../../assets/relax_zone.png';

const Features = () => {
  const featuresData = [
    { 
      title: "Wellness Tree", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in ultrices arcu. Morbi consectetur congue elit, volutpat condimentum mi aliquam in. Aenean libero orci, porttitor quis convallis posuere, blandit at nibh.", 
      image: wellnessTree,
      id: "wellness-tree"
    },
    { 
      title: "Book Your Counsellor Now", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in ultrices arcu. Morbi consectetur congue elit, volutpat condimentum mi aliquam in. Aenean libero orci, porttitor quis convallis posuere, blandit at nibh. Nunc et lacus eget libero consectetur bibendum quis non elit.", 
      image: bookCounsellor,
      id: "book-counsellor"
    },
    { 
      title: "Your Chat Buddy", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in ultrices arcu. Morbi consectetur congue elit, volutpat condimentum mi aliquam in. Aenean libero orci, porttitor quis convallis posuere, blandit at nibh. Nunc et lacus eget libero consectetur bibendum quis non elit.", 
      image: chatBuddy,
      id: "chat-buddy"
    },
    { 
      title: "Relax Zone", 
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent in ultrices arcu. Morbi consectetur congue elit, volutpat condimentum mi aliquam in. Aenean libero orci, porttitor quis convallis posuere, blandit at nibh. Nunc et lacus eget libero consectetur bibendum quis non elit.", 
      image: relaxZone,
      id: "relax-zone"
    },
  ];

  return (
    <section className="features">
      <h2 className="features-title">Our Features</h2>
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
