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
      description: "Just like a seed grows into a strong tree with care, your small daily habits can grow into lasting emotional strength. The Wellness Tree helps you track your moods, build positive routines, and stay consistent. A tree flourishes with sunlight and water; your mind flourishes with self-care and reflection. With every check-in, you plant tiny steps that become the roots of a happier, healthier you .🌱", 
      image: wellnessTree,
      id: "wellness-tree"
    },
    { 
      title: "Book Your Counsellor Now", 
      description: "Your feelings matter — and you don’t have to go through them alone. With MannMitra, booking a counsellor is quick, private, and stress-free. Whether you’re dealing with stress, anxiety, or just need someone to truly listen, our counsellors are here for you. Because opening up isn’t a weakness — it’s the first step to healing .💛", 
      image: bookCounsellor,
      id: "book-counsellor"
    },
    { 
      title: "Your Chat Buddy", 
      description: "Meet your Chat Buddy — always ready to listen, anytime you need. Whether you’re feeling low, stressed, or just want to share what’s on your mind, our AI-powered buddy is here for real-time support. No judgments, no pressure — just a safe, friendly space to talk, vent, and feel heard 💬. Because sometimes, even a small conversation can make a big difference.", 
      image: chatBuddy,
      id: "chat-buddy"
    },
    { 
      title: "Relax Zone", 
      description: "Unwind in our Relax Zone, where soothing music melt away stress and anxiety. Let the gentle melodies transport you to a peaceful state of mind, perfect for relaxation and rejuvenation. Take a deep breath, let go, and let the tranquility wash over you. Relax, recharge, and rediscover your calm.", 
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
