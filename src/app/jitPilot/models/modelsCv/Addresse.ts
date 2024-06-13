import { Region } from './Region';
import { Ville } from './Ville';

export class Addresse {
    id?: string;
    rue?: string;
    ville?: Ville;
    region?: Region;
}
