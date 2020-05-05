import {Model} from './Model';

export class SequenceModel extends Model{
    sequenceId?: number;
    name?: string;
    projectId?: number;
    thumbnail?: string;
    status?: number;
    createdAt?: number;
    updatedAt?: number;
}
