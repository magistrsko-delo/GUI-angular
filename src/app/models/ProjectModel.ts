import {Model} from './Model';

export class ProjectModel extends Model {
    projectId?: number;
    name?: string;
    thumbnail?: string;
    createdAt?: number;
    updatedAt?: number;
}
