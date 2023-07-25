import { Component, VERSION, ViewChild } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { DataTableDirective } from 'angular-datatables';

export interface Employee {
  id: number;
  name: string;
  position: string;
  office: string;
  salary: number;
}

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  version = 'Angular: v' + VERSION.full;
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  employees: Employee[];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      responsive: true,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            'http://localhost:8080/api/employees',
            dataTablesParameters,
            {}
          )
          .subscribe((resp) => {
            that.employees = resp.data;

            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: [],
            });
          });
      },
      columns: [
        { data: 'id' },
        { data: 'name', class: 'none' },
        { data: 'office' },
        { data: 'salary' },
      ],
    };
  }

  ngAfterViewInit(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      console.info('foobar');
      dtInstance.columns.adjust().responsive.recalc();
    });
  }
}
