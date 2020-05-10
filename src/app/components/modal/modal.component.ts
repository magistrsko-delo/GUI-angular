import {Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MainComponent} from '../main.component';

export class ModalComponent extends MainComponent implements OnInit {

    constructor(
        public dialogRef: MatDialogRef<ModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        super();
    }

    ngOnInit(): void {
    }
}
