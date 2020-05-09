import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MediaManagerService {
    private mediaManagerUrl = environment.mediaManagerUrl;

    constructor(
        private http: HttpClient
    ) {
    }

    public createMediaImage(mediaId: number, time: number): Observable<boolean> {
        return this.http.post(this.mediaManagerUrl + 'v1/mediaManager/' + mediaId + '/image', {
            mediaId,
            time
        })
            .pipe(map( (rsp: any) => rsp.data ) );
    }

    public uploadFile(fileToUpload: File, mediaName: string, siteName: string) {
        const formData: FormData = new FormData();
        formData.append('mediaStream', fileToUpload, fileToUpload.name);
        formData.append('siteName', siteName);
        formData.append('mediaName', mediaName);
        return this.http
            .post(this.mediaManagerUrl + 'v1/mediaManager/upload', formData);
    }
}
