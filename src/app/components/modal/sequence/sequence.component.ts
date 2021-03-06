import {Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SequenceModel} from '../../../models/SequenceModels';
import {GraphQLService} from '../../../services/graph-ql.service';
import {GraphQLRequestModel} from '../../../models/GraphQLRequest-model';
import {ToastService} from '../../../services/toast.service';
import {takeUntil} from 'rxjs/operators';

@Component({
    templateUrl: './sequence.component.html',
    styleUrls: ['./sequence.component.scss']
})
export class SequenceComponent extends ModalComponent implements OnInit {
    sequence: SequenceModel;
    isNew = false;
    constructor(
          public dialogRef: MatDialogRef<ModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: SequenceModel | number,
          private graphQLService: GraphQLService,
          private toastService: ToastService
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
        if (typeof this.data === 'number') {
            this.sequence = new SequenceModel({
                name: '',
                projectId: this.data,
                thumbnail: ''
            });
            this.isNew = true;
        } else {
            this.sequence = this.data;
            this.isNew = false;
        }
    }

    save() {
        let request: GraphQLRequestModel;
        if (this.isNew) {
            request = this.graphQLService.CreateSequence(this.sequence);
            this.graphQLService.graphQLRequest(request)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    (rsp: any) => {
                        this.dialogRef.close();
                    },
                    error => {
                        console.error('Error', error);
                        this.toastService.addToast('Napaka', error.message);
                    }
                );
        } else {
            request = this.graphQLService.UpdateSequence(this.sequence);
            this.graphQLService.graphQLRequest(request)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe(
                    (rsp: any) => {
                        this.sequence = rsp.updateSequence;
                        this.dialogRef.close(this.sequence);
                    },
                    error => {
                        console.error('Error', error);
                        this.toastService.addToast('Napaka', error.message);
                    }
                );
        }
    }

    onNoClick() {
        if (!this.isNew) {
            this.dialogRef.close(this.sequence);
        } else {
            this.dialogRef.close();
        }
    }
}
