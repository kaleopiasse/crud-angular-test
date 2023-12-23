import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbdSortableHeader, SortEvent } from './sortable.directive';
import { FormsModule } from '@angular/forms';
import { NgbHighlight, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ICLient } from '../../services/client';
import { ClientService } from '../../services/client.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-table',
	standalone: true,
	imports: [DecimalPipe, FormsModule, AsyncPipe, NgbHighlight, NgbdSortableHeader, NgbPaginationModule],
	templateUrl: './table.component.html',
  providers: [ClientService]
})
export class TableComponent {

  @Input() data = new Observable<ICLient[]>
	clients$: Observable<ICLient[]>;
	total$: Observable<number>;

	@ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

	constructor(
    public readonly clientService: ClientService,
    private readonly router: Router
  ) {
		this.clients$ = clientService.clients$;
		this.total$ = clientService.total$;
	}

	onSort({ column, direction }: SortEvent) {
		// resetting other headers
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
}
