import React, { useMemo } from 'react'; 
import { useGarden } from '../../../../GardenContext'; 
import Plant from './Plant'; 
import './Flower.css'; 

const Petal1 = ({petalColor}) => {
  return(
    <g transform={`scale(0.15) translate(-116.667, -348.254)`}>
      <path
        d="M116.667 0 0 262.5l116.667 85.754L233.333 262.5Z"
        style={{ fill: petalColor, fillOpacity: 0.795181, strokeWidth: 1.00157 }}
      />
      <path
        d="M116.667 0v348.254L233.333 262.5z"
        style={{ fill: '#000', fillOpacity: 0.204819, strokeWidth: 1.00157 }}
      />
      <path
        d="m116.667 348.254-65-65 65-170 65 170z"
        style={{ fill: '#000', fillOpacity: 0.204819, strokeWidth: 1.00157 }}
      />
    </g>
  );
}

const Petal2 = ({petalColor}) => {
  return(
    <g transform="scale(0.8) translate(-95, -190)">
      <path 
        d="M95 188.333c-13.333 0-26.667-11.666-26.667-27.5S81.667 125 95 125s26.666 20 26.666 35.833c0 15.834-13.333 27.5-26.666 27.5" 
        style={{fill:`${petalColor}`, fillOpacity:.803213, strokeWidth:.264999}}
      />
      <path 
        d="m90 190 5-25 5 25z" 
        style={{fill:'#f9f9f9', fillOpacity:.619679, strokeWidth:.264999}}
      />
      <path 
        d="m95 190-15-20 5 20zm0 0h10l5-20z" 
        style={{fill:'#f9f9f9', fillOpacity:.619679, strokeWidth:.264999}}
      />
      <path 
        d="M95 186.667c-8.333 0-16.667-13.334-16.667-28.334S86.667 126.667 95 126.667s16.667 16.666 16.667 31.666-8.334 28.334-16.667 28.334" 
        style={{fill:'#f9f9f9', fillOpacity:.200803, strokeWidth:.264999}}
      />
      <path 
        d="m85 190 10-5 10 5-10 5z" 
        style={{fill:'#8a4a019f', fillOpacity:.3, strokeWidth:.264999}}
      />
    </g>
  );
}

const Petal3 = ({petalColor}) => {
  return (
    <g transform="scale(0.454) translate(-94.9995, -230)">
      <path 
        d="m95 215-5-5s-2.556-20.161-5-30c-2.54-10.23-11.039-19.51-10-30 1.324-13.372 6.563-35 20-35s18.676 21.628 20 35c1.039 10.49-7.46 19.77-10 30-2.444 9.839-5 30-5 30z" 
        style={{ fill: petalColor, fillOpacity: 0.899598, strokeWidth: 0.264999 }}
      />
      <path 
        d="M95 210c-4.714 0-10 10-10 10l10 10 10-10s-5.286-10-10-10m0 5-5-40" 
        style={{ fill: '#045', fillOpacity: 0.502008, strokeWidth: 0.264999 }}
      />
      <path 
        d="M95 215s-11.376-43.122-10-65c.762-12.11 10-35 10-35s9.238 22.89 10 35c1.376 21.878-10 65-10 65" 
        style={{ fill: '#000', fillOpacity: 0.104418, strokeWidth: 0.264999 }}
      />
    </g>
  );
}

export default class Flower extends Plant { 
  static className = 'flower'; 
  static growthClassName = 'flower-growth'; 
  static positionWrapperClassName = 'flower-bounding-box'; 
  static stemHeightAvg = 160; 
  static stemHeightRange = 130
  static flowerSize = 160;
  static petalTypes = [{src: Petal1, petals:[5,8]}, {src: Petal2, petals:[5,8]}, {src: Petal3, petals:[8,13]}]
  static petalCol = ['#ae2732', '#4b95ef', '#f5f0f0', '#ffa601', '#ff9ff3', '#5f27cd']; 

  constructor(rand, index, appearTime) { 
    super(rand, index, appearTime); 
    // keeps flowers from touching screen edges 
    this.x = 3 + (rand() * 94); 
    // keeps wider height variations 
    this.height = this.constructor.stemHeightAvg + (rand() - 0.5) * this.constructor.stemHeightRange; 
    // petal color palette 
    this.petalCol = this.constructor.petalCol[Math.floor(rand() * this.constructor.petalCol.length)]; 
    this.petal = this.constructor.petalTypes[Math.floor(rand() * this.constructor.petalTypes.length)];
    this.petalRotateAxis = [rand()*0.2, rand(), rand()*0.8+0.2];
    this.petalCount = this.petal.petals[Math.floor(rand() * this.petal.petals.length)];
    this.shadeFac = 0.85 + (rand() * 0.15); 
    this.headScale = 0.80 + (rand() * 0.35);
  } 

  PlantImage = () => { 
    const garden = useGarden(); 
    const age = garden.elapsedTime - this.appearTime; 
    const speedFac = Math.max(1, garden.speed);

    // controls time between growing flower parts 
    const stemGrowDur = 4 / speedFac; 
    const centerPopDel = 6; 
    const petalsOpenDel = 9;

    const centerVis = age >= centerPopDel; 
    const petalsVis = age >= petalsOpenDel;

    const leafIntervalPixels = 45; // every 45px of stem height adds new leaf 
    const minLeafCount = 2; // minimum number of leaves

    const bottomSafetyMarg = 30; 
    const topSafetyMarg = 40;

    const leafLength = 24; 
    const leafThickness = 16;
    
    const totalLeafSpace = this.height - bottomSafetyMarg - topSafetyMarg; 
    const computedLeafCount = Math.max(minLeafCount, Math.floor(totalLeafSpace / leafIntervalPixels)); 

    const leftLeafPoints = `0,0 -${leafLength * 0.66},-${leafThickness * 0.375} -${leafLength},-${leafThickness} -${leafLength * 0.33},-${leafThickness * 0.625}`; 
    const rightLeafPoints = `0,0 ${leafLength * 0.66},-${leafThickness * 0.375} ${leafLength},-${leafThickness} ${leafLength * 0.33},-${leafThickness * 0.625}`; 

    const generatedLeaves = useMemo(() => { 
      return Array.from({ length: computedLeafCount }).map(((_, i) => { 
        const progressRatio = computedLeafCount > 1 ? i / (computedLeafCount - 1) : 0.5; 
        const leafVerticalOffset = bottomSafetyMarg + (totalLeafSpace * progressRatio); 
        const targetY = this.height - leafVerticalOffset; 
        const isLeft = i % 2 === 0; 
        const basePopTimeSeconds = 1.5 + (i * 0.5); 
        const leafVisible = age >= (basePopTimeSeconds / speedFac); 
        
        return { 
          id: i, 
          isLeft, 
          visible: leafVisible, 
          targetY, 
          popDelay: `${i * 0.15}s` 
        }; 
      })); 
    }, [computedLeafCount, totalLeafSpace, this.height, age, speedFac]); 

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
          style={{ overflow: 'visible', position: 'absolute', bottom: 0, left: 0}} 
        > 
          <line x1="80" y1={this.height} x2="80" y2={0} className="flower-stem" /> 
          
          <g className="flower-leaves-group"> 
            {generatedLeaves.map((leaf) => { 
              if (!leaf.visible) return null; 
              return ( 
                <polygon 
                  key={leaf.id} 
                  points={leaf.isLeft ? leftLeafPoints : rightLeafPoints} 
                  fill="#45a247" 
                  className={`flower-leaf ${leaf.isLeft ? 'leaf-left' : 'leaf-right'}`} 
                  style={{ 
                    '--leaf-y-coordinate': `${leaf.targetY}px`, 
                    '--stagger-delay': leaf.popDelay 
                  }}
                /> 
              ); 
            })} 
          </g> 

          <g transform="translate(80, 0)">
            {petalsVis && ( 
              <g className="flower-petals-group" style={{ filter: `hue-rotate(${this.hue}deg)`}} > 
                {Array.from({length:this.petalCount},(_, i) => (
                  <g
                    key={i}
                    className="flower-geo-petal"
                    style= {{ 
                      opacity: i % 2 === 0 ? 1 : this.shadeFac,
                      transform: `rotate3d(${this.petalRotateAxis.join(", ")}, ${360/this.petalCount*i}deg)`
                     }}
                  >
                  <this.petal.src petalColor={this.petalCol}/>
               </g>
                ))} 
                
              </g> 
            )} 
          </g> 
        </svg> 
      </div> 
    ); 
  } 
}