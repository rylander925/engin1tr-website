import React, { useMemo } from 'react'; 
import { useGarden } from '../../../../GardenContext'; 
import Plant from './Plant'; 
import './Flower.css'; 

export default class Flower extends Plant
{ 
  static className = 'flower'; 
  static growthClassName = 'flower-growth'; 
  static positionWrapperClassName = 'flower-bounding-box'; 
  static stemHeightAvg = 140; 
  static flowerSize = 160;

  constructor(rand, index, appearTime)
  { 
    super(rand, index, appearTime); 
    this.x = 3 + (rand() * 94); 
    // keeps wider height variations 
    this.height = this.constructor.stemHeightAvg + (rand() - 0.2) * 130; 
    // petal color palette 
    const petalCol = ['#ae2732', '#4b95ef', '#f5f0f0', '#ffa601', '#ff9ff3', '#5f27cd']; 
    this.petalCol = petalCol[Math.floor(rand() * petalCol.length)]; 
    this.shadeFac = 0.85 + (rand() * 0.15); 
    
    this.headScale = 0.80 + (rand() * 0.35);
  } 

  PlantImage = () =>
{ 
    const garden = useGarden(); 
    const age = garden.elapsedTime - this.appearTime; 
 
    const speedFac = Math.max(1, garden.speed); 
    // controls time between growing flower parts
    const stemGrowDur = 4 / speedFac; 
    const centerPopDel = 6; 
    const petalsOpenDel = 9; 

    const centerVis = age >= centerPopDel; 
    const petalsVis = age >= petalsOpenDel; 
    
    return ( 
      <div 
        className={this.constructor.className} 
        style={{ 
          transformOrigin: 'bottom center', 
          display: 'block', 
          height: this.height, 
          width: this.constructor.flowerSize, 
          transform: `scaleX(${this.flipped ? -1 : 1}) rotate(${this.lean}deg)`, 
          overflow: 'visible', 
          '--stem-duration': `${stemGrowDur}s`,
          '--head-scale': this.headScale
        }} 
      >  
        <svg 
          className="flower-svg" 
          viewBox={`-60 -60 280 ${this.height + 60}`} 
          preserveAspectRatio="xMidYMax slice" 
          style={{ overflow: 'visible', position: 'absolute', bottom: 0, left: 0 }} 
        > 
          <line 
            x1="80" 
            y1={this.height} 
            x2="80" 
            y2={0} 
            className="flower-stem" 
          /> 
        
          <g transform={`translate(80, 0)`}> 
            {petalsVis && ( 
              <g className="flower-petals-group" style={{ filter: `hue-rotate(${this.hue}deg)` }} > 
                {[0, 72, 144, 216, 288].map((angle, i) => ( 
                  <polygon 
                    key={i} 
                    points="0,-6 18,-28 0,-44 -18,-28" 
                    fill={this.petalCol} 
                    transform={`rotate(${angle})`} 
                    className="flower-geo-petal" 
                    style={{ opacity: i % 2 === 0 ? 1 : this.shadeFac }} 
                  /> 
                ))} 
              </g> 
            )} 
            {centerVis && ( 
              <polygon 
                points="0,-16 14,-8 14,8 0,16 -14,8 -14,-8" 
                fill="#fff275" 
                className="flower-center" 
              /> 
            )} 
          </g> 
        </svg> 
      </div> 
    ); 
  } 
}