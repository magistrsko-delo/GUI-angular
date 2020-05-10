import {ChangeDetectionStrategy, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ModalComponent} from '../modal.component';
import {GraphQLService} from '../../../services/graph-ql.service';
import {MediaModel} from '../../../models/MediaModel';
import {GraphQLRequestModel} from '../../../models/GraphQLRequest-model';
import {ToastService} from '../../../services/toast.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './media-edit.component.html',
    styleUrls: ['./media-edit.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MediaEditComponent extends ModalComponent implements OnInit {
    media: MediaModel;
    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: MediaModel,
        private graphqlService: GraphQLService,
        private toastService: ToastService
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
        this.media = this.data;
    }

    updateMediaReq() {
        const request: GraphQLRequestModel = this.graphqlService.MediaUpdateMutation(this.media);
        this.graphqlService.graphQLRequest(request)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(
                (rsp: any) => {
                    this.media = new MediaModel(rsp.updateMedia[0]);
                    this.dialogRef.close(this.media);
                },
                error => {
                    console.error('Error', error);
                    this.toastService.addToast('Napaka', error.message);
                }
            );
    }

    onNoClick() {
        this.dialogRef.close(this.media);
    }
}
