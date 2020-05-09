import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectModel} from '../../../models/ProjectModel';
import {GraphQLService} from '../../../services/graph-ql.service';
import {GraphQLRequestModel} from '../../../models/GraphQLRequest-model';
import {ToastService} from '../../../services/toast.service';

@Component({
    templateUrl: './project-edit.component.html',
    styleUrls: ['./project-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectEditComponent extends ModalComponent implements OnInit {
    project: ProjectModel;

    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ProjectModel,
        private graphqlService: GraphQLService,
        private changeDetector: ChangeDetectorRef,
        private toastService: ToastService
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
        this.project = this.data;
    }

    updateProject() {
        const request: GraphQLRequestModel = this.graphqlService.ProjectUpdateMutation(this.project);
        this.graphqlService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.project = new ProjectModel(rsp.updateProjectMetadata);
                    this.dialogRef.close(this.project);
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                }
            );
    }

    onNoClick(): void {
        this.dialogRef.close(this.project);
    }
}
