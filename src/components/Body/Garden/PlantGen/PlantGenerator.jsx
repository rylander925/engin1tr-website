import Generator from "./Generable";
import Grass from "./Grass";
import Flower from "./Flower";

//TODO: Add support for different plant types
const PLANT_TYPE_WEIGHTS = {'grass': 5, 'flower': 1}

export default class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    generateItemAttributes(rand, index)
    {
        const totalWeight = PLANT_TYPE_WEIGHTS.grass + PLANT_TYPE_WEIGHTS.flower;
        const roll = rand() * totalWeight;

        if (roll < PLANT_TYPE_WEIGHTS.flower)
        {
            return new Flower(rand, index, this.timeForIndex(index));
        }

        return new Grass(rand, index, this.timeForIndex(index));
    }
}