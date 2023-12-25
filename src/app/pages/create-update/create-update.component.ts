import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EMPTY, catchError, tap } from 'rxjs';

import { ClientService } from '../../services/client.service';
import { ICLient } from '../../services/client';
import { AgeValidator } from '../../validators/age.validator';
import { CpfValidator } from '../../validators/cpf.validator';
import { FullNameValidator } from '../../validators/fullName.validator';
import { MsgsInputValidation } from '../../utils/string.utils';
import { DateUtils } from '../../utils/date.utils';

@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
  templateUrl: './create-update.component.html',
  styleUrl: './create-update.component.css',
  providers: [ClientService, NgbModal, NgxMaskPipe]
})
export class CreateUpdateComponent implements OnInit {
  title: String = ''

  form = this.formBuilder.group({
    name: new FormControl('',[Validators.required, FullNameValidator.validator]),
    cpf: new FormControl('', [Validators.required, CpfValidator.validator]),
    birthDate: new FormControl('', [Validators.required, AgeValidator.validator]),
    salary: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    createdAt: new FormControl('', [Validators.required])
  })

  @ViewChild('modalCreateUpdate') modalContent!: NgbModalRef;
  modal = { modalIcon: '', modalMsg: ''}
  errorMsgs: Record<string, string> = MsgsInputValidation

  id = this.activatedRoute.snapshot.params['id'];
  private today = new Date().getTime();

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly clientService: ClientService,
    private readonly formBuilder: FormBuilder,
    private readonly modalService: NgbModal,
    private readonly ngxMaskPipe: NgxMaskPipe,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.data.pipe(
      tap((res) => this.title = res['title'])
    ).subscribe()

    if(this.id) {
      this._getClient(this.id);
    } else {
      this.form.controls.createdAt.setValue(this.ngxMaskPipe.transform(new Date(this.today).toLocaleDateString(), 'd0/M0/0000'))
      this.form.controls.createdAt.disabled;
    }
  }

  createBodyClient() {
    if(this.form.invalid) {
      this._formMsgsValidation();
      this.modalService.open(this.modalContent, { centered: true });
      return;
    }

    const {name,cpf,birthDate,salary,email,createdAt } = this.form.value

    const body: ICLient = {
      name: name || '',
      cpf: cpf || '',
      birthDate: birthDate ? DateUtils.formateDateToTimeStamp(birthDate) : '',
      salary: salary || '',
      email: email || '',
      createdAt: createdAt ? DateUtils.formateDateToTimeStamp(createdAt) : ''
    }

    if(!this.id) {
      this._saveClient(body);
    } else {
      this._editClient(body);
    }
  }

  returnPageList() {
    this.router.navigate(['']);
  }

  closeModal() {
    if (this.modal.modalIcon == 'bi-check-circle') this.returnPageList();
    this.modalService.dismissAll();
  }

  private _getClient(id: number) {
    this.clientService.getClient(id).pipe(
      tap(res => {
        this.form.setValue(
          {
            name: res.name,
            cpf: res.cpf,
            birthDate: this.ngxMaskPipe.transform(new Date(Number(res.birthDate)).toLocaleDateString(), 'd0/M0/0000'),
            salary: res.salary,
            email: res.email,
            createdAt: this.ngxMaskPipe.transform(new Date(Number(res.createdAt)).toLocaleDateString(), 'd0/M0/0000'),
          })
      }),
      catchError(() => {
        this.router.navigate(['']);
        return EMPTY;
      })
    ).subscribe();
  }

  private _editClient(body: ICLient) {
    this.clientService.editClient(this.id,body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Cliente editado com sucesso'

        this.modalService.open(this.modalContent, { centered: true })
      })
    ).subscribe()
  }

  private _saveClient(body: ICLient) {
    this.clientService.saveClient(body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Cliente adicionado com sucesso'

        this.modalService.open(this.modalContent, { centered: true })
      })
    ).subscribe()
  }

  private _formMsgsValidation() {
    let errors: any[] = [];
    this.modal.modalIcon = 'bi-exclamation-circle'
    this.modal.modalMsg = '';

    Object.keys(this.form.controls).forEach(key => {
      if(this.form.get(key)?.errors) {
        let controlsErrors = this.form.get(key)?.errors
        if(controlsErrors) Object.keys(controlsErrors).forEach(key => errors.push(key))
      };
    });
    errors = [...new Set(errors)]

    errors.forEach((item: any) => this.modal.modalMsg += `${this.errorMsgs[item]} <br>`)
  }
}
