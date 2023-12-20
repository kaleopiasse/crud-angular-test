import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [],
  templateUrl: './create-update.component.html',
  styleUrl: './create-update.component.css'
})
export class CreateUpdateComponent implements OnInit {
  title: String = ''

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      tap((res) => this.title = res['title'])
    ).subscribe()
  }

  save() {
    this.router.navigate(['']);
  }

  return() {
    this.router.navigate(['']);
  }
}
