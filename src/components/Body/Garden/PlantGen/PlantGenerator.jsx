import Generator from "./Generable";
import Grass from "./Grass";

//TODO: Add support for different plant types
const PLANT_TYPE_WEIGHTS = {'grass': 5}

export default class PlantGenerator extends Generator {
    constructor( baseInterval, slowdownFactor, seed ) {
        super(baseInterval, slowdownFactor, seed);
    }

    /*Returns a plant object
        TODO: Randomly select between different plant types rather than always to grass
    */
    generateItemAttributes(rand, index) {
        const plant = new Grass(rand, index, this.timeForIndex(index));
        return(plant);
    }
}