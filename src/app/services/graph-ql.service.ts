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

    public SearchMediaStatus(status: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'query {searchMedias(status: ' + status + '){' +
                'mediaId,' +
                'name,' +
                'siteName' +
                'thumbnail' +
                'projectId' +
                '}}'
        });
    }
}
