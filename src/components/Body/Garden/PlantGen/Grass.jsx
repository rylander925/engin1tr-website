import grass1 from '../../../../assets/plants/grass1.svg'
import grass2 from '../../../../assets/plants/grass2.svg'
import grass3 from '../../../../assets/plants/grass3.svg'
import grass4 from '../../../../assets/plants/grass4.svg'
import Plant from './Plant'

export default class Grass extends Plant {
    static variants = [grass1, grass2, grass3, grass4];
}
