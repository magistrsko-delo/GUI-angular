import {Component, Inject, OnInit} from '@angular/core';
import {ModalComponent} from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {SequenceModel} from '../../../models/SequenceModels';
import {GraphQLService} from '../../../services/graph-ql.service';
import {GraphQLRequestModel} from '../../../models/GraphQLRequest-model';

@Component({
    templateUrl: './publish-sequence.component.html',
    styleUrls: ['./publish-sequence.component.scss']
})
export class PublishSequenceComponent extends ModalComponent implements OnInit {
    sequence: SequenceModel;
    newMediaName: string;
    newMediaSiteName: string;
    constructor(
          public dialogRef: MatDialogRef<ModalComponent>,
          @Inject(MAT_DIALOG_DATA) public data: SequenceModel,
          private graphQLService: GraphQLService
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
        this.sequence = this.data;
    }

    save() {
        const request: GraphQLRequestModel = this.graphQLService.PublishSequence(
            this.sequence.sequenceId, this.newMediaName, this.newMediaSiteName);
        this.graphQLService.graphQLRequest(request)
            .subscribe(
                (rsp: any) => {
                    this.dialogRef.close(true);
                },
                error => {
                    console.log(error);
                }
            );
    }

    onNoClick() {
        this.dialogRef.close();
    }
}
