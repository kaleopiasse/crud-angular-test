import { Component } from '@angular/core';
import { TableComponent } from '../../components/table/table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [ TableComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css'
})
export class ListComponent {

  constructor(private readonly router: Router) {}

  addClient() {
    this.router.navigate(['create']);
  }
}
