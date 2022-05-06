import { Component, Inject, NgZone, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-dialog-date',
  templateUrl: './dialog-date.component.html',
  styleUrls: ['./dialog-date.component.css']
})
export class DialogDateComponent{

  contenu: string;
  name: string;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  constructor(private ngZone: NgZone,
              public dialogRef: MatDialogRef<DialogDateComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogDate) {}
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

}
export interface DialogDate {
  contenu: string;
  name: string;
  disponibilite:string;
}
