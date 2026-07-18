import { useMemo, useState, useEffect } from 'react';
import { useConditions } from '../../../../ConditionsContext';
import './Rain.css';

function Rain()
{
  const conditions = useConditions();
  const rawPrecip = conditions?.weather?.precipitation || 0;
  const windSpeed = conditions?.weather?.windSpeed || 0;

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });

    useEffect(() =>
    {
        const handleResize = () =>
            {
                setDimensions({ width: window.innerWidth, height: window.innerHeight });
            };
            handleResize();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
    }, []);

  const normPrecip = useMemo(() =>
    {
    if (rawPrecip <= 0) return 0;
    return rawPrecip > 1 ? rawPrecip / 10 : rawPrecip;
    }, [rawPrecip]);

  const dropCount = useMemo(() =>
    {
    const calculatedDrops = Math.floor(normPrecip * 120);
    return Math.max(15, Math.min(calculatedDrops, 120));
    }, [normPrecip]);

  const windParams = useMemo(() => {
    const maxSkewDeg = 35;
    const currSkewDeg = windSpeed * maxSkewDeg;
    const skewRad = (currSkewDeg * Math.PI) / 180;

    const driftPix = (dimensions.height * 1.2) * Math.tan(skewRad);
    
    const dynBufPer = (driftPix / dimensions.width) * 100;

    return{
      skewString: `${currSkewDeg}deg`,
      bufPer: dynBufPer
    };
  }, [windSpeed, dimensions]);

   const drops = useMemo(() =>
{
    return Array.from({ length: dropCount }).map((_, index) =>
    {
      const minLeft = -windParams.bufPer;
      const maxLeft = 100;
      const leftPosition = minLeft + (Math.random() * (maxLeft - minLeft));
      
      const delay = Math.random() * -2;
      const duration = 0.4 + Math.random() * 0.4;
      const opacity = 0.15 + Math.random() * 0.55;

      return{
        id: index,
        style:
        {
          left: `${leftPosition}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: opacity,
        },
      };
    });
}, [dropCount, windParams]);

  if (normPrecip <= 0) return null;

  return (
    <div className="rain-container" aria-hidden="true" style={{ '--wind-skew': windParams.skewString }}>
      {drops.map((drop) => (
        <div key={drop.id} className="rain-drop" style={drop.style} />
      ))}
    </div>
  );
}
export default Rain;