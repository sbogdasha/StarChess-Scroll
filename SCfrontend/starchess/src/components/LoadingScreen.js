import React, { useEffect, useState } from 'react';
import '../styles/LoadingScreen.css';

const LoadingScreen = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Після завантаження сторінки приховуємо анімацію (можете змінити час за необхідністю)

    return () => {
      setLoading(true);
    };
  }, []);

  return (
    <div className={`loading-screen ${loading ? '' : 'hidden'}`}>
      <img
        src="/imgbg/logo/starchess.gif"
        alt="Loading Animation"
        className="loading-animation"
      />
    </div>
  );
};

export default LoadingScreen;
