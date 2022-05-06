import { Component, Inject, NgZone, ViewChild} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import {NgbDate, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import { DemandeService } from './../../../services/demande.service';

@Component({
  selector: 'app-dialog-text',
  templateUrl: './dialog-text.component.html',
  styleUrls: ['./dialog-text.component.css']
})
export class DialogTextComponent {
  contenu: string;
  name: string;
  disponibilite: string;
  // displayMonths = 1;
  // navigation = 'select';
  // showWeekNumbers = false;
  // outsideDays = 'visible';
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;


  constructor(private ngZone: NgZone,
              private demandeService: DemandeService,
              calendar: NgbCalendar,
              public dialogRef: MatDialogRef<DialogTextComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                this.fromDate = calendar.getToday();
                this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
              }
  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this.ngZone.onStable.pipe(take(1))
        .subscribe(() => this.autosize.resizeToFitContent(true));
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.disponibilite = `Du ${this.fromDate.day}-${this.fromDate.month}-${this.fromDate.year} au ${this.toDate.day}-${this.toDate.month}-${this.toDate.year}`;
    // this.data.disponibilite = this.disponibilite;
    this.demandeService.demandeDispo = this.disponibilite;
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

}
export interface DialogData {
  contenu: string;
  name: string;
}
