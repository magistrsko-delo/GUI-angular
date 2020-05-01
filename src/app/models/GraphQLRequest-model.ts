import {Model} from './Model';

export class GraphQLRequestModel extends Model{
    query: string;
    variables?: object;
}
