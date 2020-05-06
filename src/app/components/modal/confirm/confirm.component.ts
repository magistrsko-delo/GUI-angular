import {Component, Inject, OnInit} from '@angular/core';
import { ModalComponent } from '../modal.component';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ProjectModel} from '../../../models/ProjectModel';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent extends ModalComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: string,
    ) {
        super(dialogRef, data);
    }

    ngOnInit(): void {
    }

}
