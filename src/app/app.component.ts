import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { MatTableDataSource, MatSort, PageEvent, MatPaginator } from '@angular/material';
import { TruncatePipe } from './TruncatePipe';
export interface VideoData {
  Title: string;
  Description: string;
  PublishedAt: string;
  URL: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private apiService: ApiService) { }
  VideoData = [];

  dataSource;
  length = 10;
  pageSize = 3;
  errorMessage: string;
  errorCode: string;
  tableColumns = ['Title', 'Description', 'PublishedAt', 'URL'];
  pageEvent: PageEvent;
  prevPageToken: string;
  nextPageToken: string;
  pageToken: string;
  pageIndex = 0;
  maxvalue = 10;
  remainder = this.maxvalue;
  reqobj = {};
  part = 'snippet';
  order = 'date';
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  title = 'youapp';

  ngOnInit() {
    this.getServerData();
  }

  public getServerData(event?: PageEvent) {
    this.dataSource = [];
    this.VideoData = [];
    if (event) {
      if (event.pageIndex === this.pageIndex + 1) {
        this.remainder = this.remainder - this.pageSize;
        this.pageToken = this.nextPageToken;
      } else if (event.pageIndex === this.pageIndex - 1) {
        this.remainder = this.remainder + this.pageSize;
        this.pageToken = this.prevPageToken;
      }
      this.pageIndex = event.pageIndex;
    } else {

      this.pageToken = '';
    }


    this.reqobj = {
      pageToken: this.pageToken,
      maxResults: ((this.remainder < this.pageSize) ? this.remainder : this.pageSize),
      part: this.part,
      order: this.order
    };
    this.apiService.getData(this.reqobj).subscribe(
      (data: any[]) => {

        Object.keys(data).forEach(key => {
          if (key === 'nextPageToken') {

            this.nextPageToken = data[key];
          }
          if (key === 'prevPageToken') {

            this.prevPageToken = data[key];

          }
          if (key === 'items') {

            Object.keys(data[key]).forEach(key1 => {


              const eachvideo = {
                Title: data[key][key1].snippet.title,
                Description: data[key][key1].snippet.description,
                PublishedAt: data[key][key1].snippet.publishedAt,
                URL: data[key][key1].snippet.thumbnails.default.url
              };
              this.VideoData.push(eachvideo);

            });

          }
        });
        this.dataSource = new MatTableDataSource(this.VideoData);
        this.dataSource.data = this.VideoData;

        this.dataSource.sort = this.sort;
        // this.dataSource.paginator = this.paginator;


      },
      error => {

        this.errorMessage = 'Something went Wrong. Please try again later';
        console.log('ErrorCode: ' + error.status);


      });

  }
}
