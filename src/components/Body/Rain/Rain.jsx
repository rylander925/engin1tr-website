import { useMemo } from 'react';
import { useConditions } from '../../../ConditionsContext';
import './Rain.css';

function Rain()
{
  const conditions = useConditions();
  const rawPrecipitation = conditions?.weather?.precipitation || 0;
  const windSpeed = conditions?.weather?.windSpeed || 0;

  const normalizedPrecipitation = useMemo(() => {
    if (rawPrecipitation <= 0) return 0;
    return rawPrecipitation > 1 ? rawPrecipitation / 10 : rawPrecipitation;
  }, [rawPrecipitation]);

  const dropCount = useMemo(() => {
    const calculatedDrops = Math.floor(normalizedPrecipitation * 120);
    return Math.max(15, Math.min(calculatedDrops, 120));
  }, [normalizedPrecipitation]);

  const windStyles = useMemo(() => {
    const maxSkewDegrees = 35;
    const currentSkew = windSpeed * maxSkewDegrees;
    const maxHorizontalDriftPixels = windSpeed * 250;

    return {
      '--wind-skew': `${currentSkew}deg`,
      '--wind-drift': `${maxHorizontalDriftPixels}px`
    };
  }, [windSpeed]);

  const drops = useMemo(() =>{
    return Array.from({ length: dropCount }).map((_, index) =>
    {
      const leftPosition = -20 + (Math.random() * 130);
      const delay = Math.random() * -2;
      const duration = 0.4 + Math.random() * 0.4;
      const opacity = 0.15 + Math.random() * 0.55;

      return {
        id: index,
        style: {
          left: `${leftPosition}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
          opacity: opacity,
        },
      };
    });
  }, [dropCount]);

    if (normalizedPrecipitation <= 0) return null;

  return (
    <div className="rain-container" aria-hidden="true" style={windStyles}>
      {drops.map((drop) => (
        <div key={drop.id} className="rain-drop" style={drop.style} />
      ))}
    </div>
  );
}

export default Rain;