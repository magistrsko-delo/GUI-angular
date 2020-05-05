import {Model} from './Model';

export class IMediaStream extends Model{
    type: 'hls';
    source: string;
    label: string;
    poster: string;
}
