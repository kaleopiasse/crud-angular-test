import { AsyncPipe, CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbHighlight, NgbPaginationModule, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, tap } from 'rxjs';
import { NgxMaskPipe, NgxMaskDirective } from 'ngx-mask';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { ICLient } from '../../services/client';
import { ClientService } from '../../services/client.service';

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [CommonModule, DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule, NgxMaskPipe, NgxMaskDirective],
	templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  providers: [ClientService, DatePipe, NgbModal]
})
export class TableComponent {

  @Input() data = new Observable<ICLient[]>
	clients$: Observable<ICLient[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  @ViewChild('modalDelete') modalContent!: NgbModalRef;

  modalRef!: NgbModalRef;
  modal = { modalIcon: '', modalMsg: '', step: 1 };
  clientId!:  number;

	constructor(
    public readonly clientService: ClientService,
    private readonly modalService: NgbModal,
    private readonly router: Router
  ) {
		this.clients$ = clientService.clients$;
		this.total$ = clientService.total$;
	}

	onSort({ column, direction }: SortEvent) {
		this.headers.forEach((header) => {
			if (header.sortable !== column) {
				header.direction = '';
			}
		});

		this.clientService.sortColumn = column;
		this.clientService.sortDirection = direction;
	}

  addClient() {
    this.router.navigate(['create']);
  }

  viewDetails(id: number | undefined) {
    this.router.navigate(['details', id]);
  }

  verifyDelete(id: number) {
    this.clientId = id;
    if(this.modal.step === 1) {
      this.modal.modalIcon = 'bi-exclamation-circle';
      this.modal.modalMsg = 'Você tem certeza que deseja excluir este cliente?'
      this.modalRef = this.modalService.open(this.modalContent, { centered: true })
    }
  }

  confirmBtnModal() {
    if(this.modal.step === 1) {
      this.modal.step += 1;
      if(this.clientId) this.clientService.deleteClient(this.clientId).pipe(
        tap(()=> {
          this.modal.modalIcon = 'bi-check-circle';
          this.modal.modalMsg = 'Cliente excluido com sucesso'
        })
      ).subscribe();
    } else {
      this.clientService._search$.next();
      this.modalService.dismissAll();
      this.modal.step = 1
    }
  }
}
