import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {GraphQLRequestModel} from '../models/GraphQLRequest-model';
import {ProjectModel} from '../models/ProjectModel';
import {SequenceModel} from '../models/SequenceModels';

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
                'thumbnail,' +
                'createdAt,' +
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
                'thumbnail,' +
                'awsBucketWholeMedia,' +
                'awsStorageNameWholeMedia,' +
                'createdAt,' +
                'length,' +
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
                'thumbnail,' +
                'awsBucketWholeMedia,' +
                'awsStorageNameWholeMedia,' +
                'createdAt,' +
                'length,' +
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

    public ProjectUpdateMutation(project: ProjectModel): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($projectUpdate: UpdateProjectMetadata!) { updateProjectMetadata(projectUpdate: $projectUpdate) { projectId, name, thumbnail, createdAt } }',
            variables: {
                projectUpdate: project
            }
        });
    }

    public DeleteProjectMutation(projectId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation {deleteProject(projectId: ' + projectId + '){' +
                'projectId,' +
                'name,' +
                'thumbnail,' +
                'createdAt,' +
                '}}'
        });
    }

    public MediaUpdateMutation(media: ProjectModel): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($mediaData: UpdateMedia!) { updateMedia(mediaData: $mediaData) { ' +
                'mediaId,' +
                'name,' +
                'siteName,' +
                'thumbnail,' +
                'projectId,' +
                'status,' +
                'thumbnail,' +
                'awsBucketWholeMedia,' +
                'awsStorageNameWholeMedia,' +
                'createdAt,' +
                '} }',
            variables: {
                mediaData: media
            }
        });
    }

    public CreateSequence(newSequenceData: SequenceModel): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($newSequence: InputSequenceType!) { createSequence(newSequence: $newSequence) { ' +
                'sequenceId,' +
                'name,' +
                'projectId,' +
                'thumbnail,' +
                'status,' +
                '} }',
            variables: {
                newSequence: newSequenceData
            }
        });
    }

    public UpdateSequence(sequence: SequenceModel): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($updateSequenceData: InputSequenceType!) { updateSequence(updateSequenceData: $updateSequenceData) { ' +
                'sequenceId,' +
                'name,' +
                'projectId,' +
                'thumbnail,' +
                'status,' +
                '} }',
            variables: {
                updateSequenceData: sequence
            }
        });
    }

    public DeleteSequenceMutation(projectId: number, sequenceId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation {deleteSequence(projectId: ' + projectId + ', sequenceId: ' + sequenceId + '){' +
                'sequenceId,' +
                'name,' +
                'projectId,' +
                'thumbnail,' +
                'status,' +
                '}}'
        });
    }

    public CutMedia(from: number, to: number, projectId: number, mediaId: number): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($cutMediaInput: CutMediaType!) { cutMedia(cutMediaInput: $cutMediaInput) { ' +
                'mediaId,' +
                'name,' +
                'siteName,' +
                'thumbnail,' +
                'projectId,' +
                'status,' +
                'thumbnail,' +
                'awsBucketWholeMedia,' +
                'awsStorageNameWholeMedia,' +
                'createdAt,' +
                '} }',
            variables: {
                cutMediaInput: {
                    from,
                    to,
                    projectId,
                    mediaId,
                }
            }
        });
    }

    public PublishSequence(sequenceId: number, name: string, siteName: string): GraphQLRequestModel {
        return new GraphQLRequestModel({
            query: 'mutation ($publishData: PublishSequenceType!) {publishSequence(publishData: $publishData){' +
                'isPublished,' +
                '}}',
            variables: {
                publishData: {
                    sequenceId,
                    name,
                    siteName
                }
            }
        });
    }
}
