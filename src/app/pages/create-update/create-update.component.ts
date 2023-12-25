import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { tap } from 'rxjs';
import { ClientService } from '../../services/client.service';
import { ICLient } from '../../services/client';
import { CpfValidator } from '../../validators/cpf.validator';
import { CommonModule } from '@angular/common';
import { FullNameValidator } from '../../validators/fullName.validator';
import { MsgsInputValidation } from '../../utils/string.utils';

@Component({
  selector: 'app-create-update',
  standalone: true,
  imports: [CommonModule, NgxMaskDirective, NgxMaskPipe, ReactiveFormsModule],
  templateUrl: './create-update.component.html',
  styleUrl: './create-update.component.css',
  providers: [ClientService, NgbModalConfig, NgbModal, NgxMaskPipe]
})
export class CreateUpdateComponent implements OnInit {
  title: String = ''

  form = this.formBuilder.group({
    name: new FormControl('',[Validators.required, FullNameValidator.validator]),
    cpf: new FormControl('', [Validators.required, CpfValidator.validator]),
    birthDate: new FormControl('', [Validators.required]),
    salary: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    createdAt: new FormControl('', [Validators.required])
  })

  modal = { modalIcon: '', modalMsg: ''}
  errorMsgs: Record<string, string> = MsgsInputValidation

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

    this.form.controls.createdAt.setValue(this.ngxMaskPipe.transform(new Date(this.today).toLocaleDateString(), 'd0/M0/0000'))
    this.form.controls.createdAt.disabled;
  }

  save(content: TemplateRef<any>) {
    if(this.form.invalid) {
      this._formMsgsValidation();
      this.modalService.open(content, { centered: true });
      return;
    }

    const {name,cpf,birthDate,salary,email,createdAt } = this.form.value

    const body: ICLient = {
      name: name || '',
      cpf: cpf || '',
      birthDate: birthDate ? this._formateDateToTimeStamp(birthDate) : '',
      salary: salary || '',
      email: email || '',
      createdAt: createdAt ? new Date(this.today).getTime().toString() : ''
    }

    this.clientService.saveClient(body).pipe(
      tap(() =>{
        this.modal.modalIcon = 'bi-check-circle';
        this.modal.modalMsg = 'Cliente adicionado com sucesso'

        this.modalService.open(content, { centered: true })
      })
    ).subscribe()
  }

  returnPageList() {
    this.router.navigate(['']);
  }

  closeModal() {
    if (this.modal.modalIcon == 'bi-check-circle') this.returnPageList();
    this.modalService.dismissAll();
  }

  private _formateDateToTimeStamp(datePtBr: string) {
    let datePtBrArray = datePtBr.split('/');
    return new Date(`${datePtBrArray[2]}-${datePtBrArray[1]}-${datePtBrArray[0]}`).getTime().toString();
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
