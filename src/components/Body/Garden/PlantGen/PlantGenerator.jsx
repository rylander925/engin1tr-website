import Generator from "./Generable";
import Grass from "./Grass";
import Flower from "./Flower";

//TODO: Add support for different plant types
const PLANT_TYPE_WEIGHTS = {'grass': 5, 'flower': 2}

export default class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    /*Returns a plant object
        TODO: Randomly select between different plant types rather than always to grass
    */
    generateItemAttributes(rand, index)
    {
        const totalWeight = PLANT_TYPE_WEIGHTS.grass + PLANT_TYPE_WEIGHTS.flower;
        const roll = rand() * totalWeight;

        if (roll < PLANT_TYPE_WEIGHTS.flower)
        {
            return new Flower(rand, index, this.timeForIndex(index));
        }

        const plant = new Grass(rand, index, this.timeForIndex(index));
        return(plant);
    }
}