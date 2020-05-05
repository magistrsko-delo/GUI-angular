import {Model} from './Model';
import {SequenceModel} from './SequenceModels';
import {MediaModel} from './MediaModel';

export class SequenceMediaModel extends Model {
    sequence: SequenceModel;
    Medias: Array<MediaModel>;
}
