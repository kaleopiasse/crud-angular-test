import { SortColumn, SortDirection } from "../components/table/sortable.directive";

export interface ICLient {
  id?: number;
  name: string;
  email: string;
  cpf: string;
  salary: string;
  birthDate: string;
  createdAt: string;
}

export interface IState {
	page: number;
	pageSize: number;
	searchTermName: string;
  searchTermCPF: string;
  searchTermBirthDate: string;
	sortColumn: SortColumn;
	sortDirection: SortDirection;
}
