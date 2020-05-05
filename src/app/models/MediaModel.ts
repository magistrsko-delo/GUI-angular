import {Model} from './Model';

export class MediaModel extends Model{
    mediaId?: number;
    name?: string;
    siteName?: string;
    length?: number;
    thumbnail?: string;
    projectId?: number;
    awsBucketWholeMedia?: string;
    awsStorageNameWholeMedia?: string;
    createdAt?: number;
    updatedAt?: number;
    keywords?: Array<string>;
}
