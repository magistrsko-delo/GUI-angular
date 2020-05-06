import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {GraphQLRequestModel} from '../models/GraphQLRequest-model';

@Injectable({
    providedIn: 'root'
})
export class GraphQLService {

    private graphQLUrl = environment.graphql;

    constructor(
        private http: HttpClient
    ) {
    }

    public graphQLRequest(requestData: GraphQLRequestModel): Observable<any> {
        return this.http.post(this.graphQLUrl, requestData)
            .pipe(map( (rsp: any) => new Object(rsp.data) ) );
    }

    public GetProjectDataRequest(): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {projectsMetadata{' +
                'projectId,' +
                'name,' +
                'thumbnail' +
                '}}'
        });
    }

    public GetOneProjectDataRequest(projectId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {oneProjectMetadata(projectId: ' + projectId + '){' +
                'projectId,' +
                'name,' +
                '}}'
        });
    }

    public SearchMediaStatus(status: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {searchMedias(status: ' + status + '){' +
                'mediaId,' +
                'name,' +
                'siteName,' +
                'thumbnail,' +
                'projectId,' +
                'status,' +
                '}}'
        });
    }

    public GetProjectMedias(projectId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {searchMedias(projectId: ' + projectId + '){' +
                'mediaId,' +
                'name,' +
                'siteName,' +
                'thumbnail,' +
                'projectId,' +
                'status,' +
                '}}'
        });
    }

    public GetProjectSequences(projectId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {getProjectSequences(projectId: ' + projectId + '){' +
                'sequenceId,' +
                'name,' +
                'projectId,' +
                'thumbnail,' +
                'status,' +
                '}}'
        });
    }

    public GetSequenceMedias(sequenceId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {getSequenceMedias(sequenceId:' + sequenceId + ')' +
                '{sequence{sequenceId, name, status}, ' +
                'Medias{mediaId, name, siteName, status, thumbnail, projectId} ' +
                '}}'
        });
    }

    public ManageMediaInSequence(sequenceId: number, mediaId: number, isDelete: boolean, isAdd: boolean): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation {manageMediaInSequence(sequenceId:' + sequenceId + ', mediaId: ' + mediaId + ', isDelete: ' + isDelete + ', isAdd: ' + isAdd + ')' +
                '{sequence{sequenceId, name, status}, ' +
                'Medias{mediaId, name, siteName, status, thumbnail, projectId} ' +
                '}}'
        });
    }
}
