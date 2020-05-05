import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MainComponent} from '../main.component';
import {GraphQLService} from '../../services/graph-ql.service';
import {Router} from '@angular/router';
import {GraphQLRequestModel} from '../../models/GraphQLRequest-model';

@Component({
    selector: 'app-project-media-editing',
    templateUrl: './project-media-editing.component.html',
    styleUrls: ['./project-media-editing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectMediaEditingComponent implements OnInit {

    constructor(
        private graphQLService: GraphQLService,
        private router: Router,
        private changeDetector: ChangeDetectorRef,
    ) {
        // super();
    }

    ngOnInit(): void {
    }

    tabEvent(tabIndex: number) {
        console.log(tabIndex);
    }

    private privateGetMediasStatus(status: number) {
        const request: GraphQLRequestModel =  this.graphQLService.SearchMediaStatus(status);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    console.log('media live: ', rsp);
                },
                error => {
                    console.log(error);
                }
            );
    }
}
