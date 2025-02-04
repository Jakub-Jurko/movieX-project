import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);  // Posune stránku na začátek
  }, [location]);

  return null;  // Tento komponent nic nezobrazuje, pouze provádí efekt
};

export default ScrollToTop;
