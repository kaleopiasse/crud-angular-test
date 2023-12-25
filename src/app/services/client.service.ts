import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, debounceTime, delay, map, of, switchMap, tap } from 'rxjs';
import { ICLient, IState } from './client';
import { SortColumn, SortDirection } from '../components/table/sortable.directive';

@Injectable()
export class ClientService {

  private _endpoint = 'http://localhost:3000/clients'

  private _state: IState = {
		page: 1,
		pageSize: 5,
    searchTermName: '',
		searchTermCPF: '',
    searchTermBirthDate: '',
		sortColumn: '',
		sortDirection: '',
	};

  public _search$ = new Subject<void>();
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _total$ = new BehaviorSubject<number>(0);
  private _clients$ = new BehaviorSubject<ICLient[]>([]);


  constructor(private http: HttpClient) {
		this._search$
			.pipe(
				tap(() => this._loading$.next(true)),
				debounceTime(200),
				switchMap(() => this.http.get<HttpResponse<any>>(this._getUrl(), { observe: 'response'})
        .pipe(
          map((res: HttpResponse<any>) => {
            const total = res.headers.get('X-Total-Count') as unknown as number;
            const clients = res.body;
            return ({total, clients})
          })
        )),
				delay(200),
				tap(() => this._loading$.next(false)),
			)
			.subscribe((result) => {
				this._clients$.next(result.clients);
				this._total$.next(result.total);
			});

		this._search$.next();
  }

  getClient(id: number): Observable<ICLient> {
    return this.http.get(this._endpoint + '/' + id) as Observable<ICLient>;
  }

  saveClient(body: ICLient) {
    return this.http.post(this._endpoint, body);
  }

  editClient(id: number, body: ICLient) {
    return this.http.put(this._endpoint + '/' + id, body);
  }

  deleteClient(id: number) {
    return this.http.delete(this._endpoint + '/' + id);
  }

  get clients$() {
		return this._clients$;
	}
  get total$() {
		return this._total$.asObservable();
	}
  get loading$() {
		return this._loading$.asObservable();
	}
	get page() {
		return this._state.page;
	}
	get pageSize() {
		return this._state.pageSize;
	}
	get searchTermName() {
		return this._state.searchTermName;
	}
  get searchTermCPF() {
		return this._state.searchTermCPF;
	}
  get searchTermBirthDate() {
		return this._state.searchTermBirthDate;
	}

	set page(page: number) {
		this._set({ page });
	}
	set pageSize(pageSize: number) {
		this._set({ pageSize });
	}
  set searchTermName(searchTermName: string) {
		this._set({ searchTermName });
	}
	set searchTermCPF(searchTermCPF: string) {
		this._set({ searchTermCPF });
	}
  set searchTermBirthDate(searchTermBirthDate: string) {
		this._set({ searchTermBirthDate });
	}
	set sortColumn(sortColumn: SortColumn) {
		this._set({ sortColumn });
	}
	set sortDirection(sortDirection: SortDirection) {
		this._set({ sortDirection });
	}

	private _set(patch: Partial<IState>) {
		Object.assign(this._state, patch);
    this._getUrl();
    this._search$.next();
	}

  private _getUrl() {
    let url: string = this._endpoint;

    url += `?_page=${this._state.page}&_limit=${this._state.pageSize}`
    if(this._state.sortDirection) url += `&_sort=${this._state.sortColumn}&_order=${this._state.sortDirection}`
    if(this._state.searchTermName) url += `&name_like=${this._state.searchTermName}`
    if(this._state.searchTermCPF) url += `&cpf_like=${this._state.searchTermCPF}`
    if(this._state.searchTermBirthDate) url += `&birthDate_like=${this._state.searchTermBirthDate}`

    return url;
  }

}
