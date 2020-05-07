import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MediaManagerService {
    private mediaMaanagerUrl = environment.mediaManagerUrl;

    constructor(
        private http: HttpClient
    ) {
    }

    public createMediaImage(mediaId: number, time: number): Observable<boolean> {
        return this.http.post(this.mediaMaanagerUrl + 'v1/mediaManager/' + mediaId + '/image', {
            mediaId,
            time
        })
            .pipe(map( (rsp: any) => rsp.data ) );
    }
}
