import { Component } from '@angular/core';
import { AtmService } from '../../services/atm.services';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    PaginationComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  listATM: any[] = [];
  fullATMList: any[] = [];
  totalItems = 0;
  itemsPerPage = 5;
  currentPage = 1;
  isLoading: boolean = true;
  isEditing = false;
  isCallAPI = false;
  searchQuery: string = '';
  atmForm: any;
  selectedATM: any = null;
  onDestroy$: Subject<void> = new Subject();

  constructor(private atmService: AtmService, private fb: FormBuilder) {}

  ngOnInit() {
    this.fetchData();

    this.atmForm = this.fb.group({
      name: ['', Validators.required],
      manufacturer: ['', Validators.required],
      type: ['', Validators.required],
      serial_number: ['', [Validators.required, Validators.minLength(6)]],
      image: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  fetchData() {
    this.isLoading = true;
    this.atmService
      .getATMs()
      .pipe(
        takeUntil(this.onDestroy$),
        catchError((error) => {
          let errorMessage = 'Unknown error';
          if (error.name === 'TimeoutError') {
            errorMessage = 'TIME_OUT_REQUEST';
          } else if (error.status === 0) {
            errorMessage = 'ERR_INTERNET_DISCONNECTED';
          } else {
            errorMessage =
              error.error?.message || error.message || 'Unknown error';
          }
          // Show toast message if has Toast Component
          console.log(errorMessage);
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any[]) => {
        if (data?.length) {
          this.totalItems = data.length;
          this.listATM = this.fullATMList = data.slice(
            (this.currentPage - 1) * this.itemsPerPage,
            this.currentPage * this.itemsPerPage
          );
        } else {
          this.listATM = [];
          this.totalItems = 0;
        }
      });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchData();
  }

  searchATM() {
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) {
      this.fetchData();
      return;
    }

    this.listATM = this.fullATMList.filter(
      (atm) =>
        atm.name.toLowerCase().includes(query) ||
        atm.manufacturer.toLowerCase().includes(query) ||
        atm.type.toLowerCase().includes(query) ||
        atm.serial_number.toLowerCase().includes(query)
    );
    if (this.listATM?.length > 0) {
      this.totalItems = 1;
    }
  }

  // Edit ATM
  handleEditATM(atm: any) {
    this.selectedATM = atm;
    this.isEditing = true;
    this.atmForm.patchValue(atm);
  }

  // Add ATM
  handleAddATM() {
    this.selectedATM = null;
    this.isEditing = true;
    this.atmForm.reset();
  }

  // Handle save ATM
  saveATM() {
    if (this.atmForm.invalid) return;
    
    this.isCallAPI = true;
    if (this.selectedATM) {
      setTimeout(()=> {
        this.listATM = this.listATM.map((atm) =>
          atm.id === this.selectedATM.id ? { ...atm, ...this.atmForm.value } : atm)
      }, 2000)
    } else {
      this.handleAddATM();
    }

    this.isEditing = false;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  callAddATM() {
    this.isCallAPI = true;
    this.atmService
      .addATM(this.atmForm.value)
      .pipe(
        takeUntil(this.onDestroy$),
        catchError((error) => {
          let errorMessage = 'Unknown error';
          if (error.name === 'TimeoutError') {
            errorMessage = 'TIME_OUT_REQUEST';
          } else if (error.status === 0) {
            errorMessage = 'ERR_INTERNET_DISCONNECTED';
          } else {
            errorMessage =
              error.error?.message || error.message || 'Unknown error';
          }
          // Show toast message if has Toast Component
          console.log(errorMessage);
          return of([]);
        }),
        finalize(() => {
          this.isCallAPI = false;
        })
      )
      .subscribe((data: any[]) => {
        this.fetchData();
      });
  }

  // Delete ATM
  handleDeleteATM(atm: any) {
    this.isCallAPI = true;
    this.atmService
      .deleteATM(atm.id)
      .pipe(
        takeUntil(this.onDestroy$),
        catchError((error) => {
          let errorMessage = 'Unknown error';
          if (error.name === 'TimeoutError') {
            errorMessage = 'TIME_OUT_REQUEST';
          } else if (error.status === 0) {
            errorMessage = 'ERR_INTERNET_DISCONNECTED';
          } else {
            errorMessage =
              error.error?.message || error.message || 'Unknown error';
          }
          // Show toast message if has Toast Component
          console.log(errorMessage);
          return of([]);
        }),
        finalize(() => {
          this.isCallAPI = false;
        })
      )
      .subscribe((data: any[]) => {
        this.fetchData();
      });
  }
}
