import { useGarden, useGardenDispatch } from "../../../../GardenContext";
import '../Garden.css'

export default class Plant {
    static className = 'plant';
    static gustClassName = 'plant-gust';
    static swayClassName = 'plant-sway';
    static positionWrapperClassName = 'plant-bounding-box';

    static variants = []; //override by child class, should contain array of imports to plant varieties

    static spreadRate = 2;                  // determines how far plants can grow from the center 
                                            // as a function of the number of plants

    static heightAverage = 175;             // pixels
    static heightRange = 150;               // pixels, total range in grass height
    static leanRange = 30;                  // angle, total range in plant tilt
    static hueShiftRange = 40;              // angle, total range in hue between plants (used in hueRotate transformation)
    
    static growDuration = 10;               // seconds for plant to grow, same for every plant

    static swayDurationAverage = 8;         // seconds, determines plant sway speed
    static swayDurationRange = 10;          // seconds, total range in sway durations

    static gustPositionDelayFactor = 0.7;   // determines how much later plants to the right are affected by swaying
                                                // gust delay is gustPositionDelayFactor * x/100 seconds
                                                // (x is from 0 to 100)

    id = -1;
    appearTime = -1;                        // used to track whether or not to play growth animation
    src = '';                               // source used in <img>
    x = -1;                                 // percent of screen, passed as x%
    y = 0;                                  // percent of screen, passed as y%
    height = -1;                            // pixels
    flipped = false;                        // if true, flips the L/R orientation of plant
    lean = 0;                               // angle to tilt plant
    hue = 0;                                // angle to hueRotate
    gustDelay = 0;                          // determined by x position, used to make right plants gust later than left plants
    swayDuration = 0;                       // determines how fast plants sway in the wind.
    swayDelay = 0;                          // determines initial delay (used to create phase difference in plant sways)

    //Source must be set in child class constructor
    //rand is a function that generates a number between 0 and 1
    constructor(rand, index, appearTime) {
        this.id = index;
        this.appearTime = appearTime;
        this.src = this.constructor.variants[Math.floor(rand() * this.constructor.variants.length)];

        this.x = 50 + (rand() - 0.5) * Math.min(index * this.constructor.spreadRate, 100);               //X is assumed to be a percent viewport width
        this.y = 0;
        this.height = this.constructor.heightAverage + (rand() - 0.5) * this.constructor.heightRange;

        this.flipped = rand() < 0.5;
        this.lean = (rand() - 0.5) * this.constructor.leanRange;
        this.hue = (rand() - 0.5) * this.constructor.hueShiftRange;

        this.gustDelay = this.constructor.gustPositionDelayFactor * this.x/100;
        
        this.swayDuration = this.constructor.swayDurationAverage + (rand() - 0.5) * this.constructor.swayDurationRange;
        this.swayDelay = rand() * -this.constructor.swayDurationAverage; //negative number starts plants in random points in their sway pattern
    }

    //By default does not take children.
    Plant = () => {
        const garden = useGarden();

        //Keep track of age to determine whether to play growth animation
        const age = garden.elapsedTime - this.appearTime;
        const stillGrowing = age < this.constructor.growDuration * garden.speed;

        return(
            <this.PlantPositionWrapper>
                <this.PlantAnimation>
                    <img
                        className = {this.constructor.className}
                        src = {this.src}
                        style = {{
                            transformOrigin: 'bottom center',
                            display: 'block',
                            
                            height: this.height,
                            transform: `scaleX(${this.flipped ? -1 : 1}) 
                                        rotate(${this.lean}deg)`,
                            filter: `hue-rotate(${this.hue}deg)`,

                            //Growth animation
                            //if elapsedTime is set past age, doesnt show animation
                            clipPath: stillGrowing ? undefined : 'inset(0% 0 0 0)',
                            animation: stillGrowing ?
                                `growReveal ${this.constructor.growDuration/garden.speed}s ease-in-out 0s both`
                                : undefined,
                        }}
                    />
                </this.PlantAnimation>
            </this.PlantPositionWrapper>
        )
    }

    PlantPositionWrapper = ({children}) => {
        const gardenDispatch = useGardenDispatch();
        return(
            <div
                className = {this.constructor.positionWrapperClassName} //Set outline visible in css to show hitbox
                onMouseEnter={() => gardenDispatch({type:'set-hovering'})}
                onMouseLeave={() => gardenDispatch({type:'unset-hovering'})}
                style = {{
                        left: `${this.x}%`,
                        bottom: `${this.y}%`,
                        position: 'absolute'
                }}
            >
                {children}
            </div>
        );
    }

    PlantAnimation = ({children}) => {
        return (
            <this.GustAnimation>
                <this.SwayAnimation>
                    {children}
                </this.SwayAnimation>
            </this.GustAnimation>
        );
    }

    GustAnimation = ({children}) => {
        return(
            <div
                className = {this.constructor.gustClassName}
                style = {{ 
                    '--gust-delay': `${this.gustDelay}s`,
                    transformOrigin: 'bottom center',
                }}
            >
                {children}
            </div>
        )
    }

    SwayAnimation = ({children}) => {
        return (
            <div
                className = {this.constructor.swayClassName}
                style = {{
                    '--sway-duration': `${this.swayDuration}s`,
                    '--sway-delay': `${this.swayDelay}s`,
                    transformOrigin: 'bottom center',
                }}
            >
                {children}
            </div>
        )   
    }
}