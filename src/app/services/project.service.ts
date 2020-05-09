import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ProjectService {
    private projectUrl = environment.projectUrl;
    constructor(
        private http: HttpClient
    ) { }

    public createProject(fileToUpload: File, projectName: string) {
        const formData: FormData = new FormData();
        formData.append('projectPicture', fileToUpload, fileToUpload.name);
        formData.append('projectName', projectName);
        return this.http
            .post(this.projectUrl + 'v1/project/metadata', formData);
    }
}
