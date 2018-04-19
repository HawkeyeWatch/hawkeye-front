import { Component, OnInit } from '@angular/core';

import { DataService } from "../data.service";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nodes: Node[];

  constructor(
    private ds: DataService
  ) { }

  ngOnInit() {
    this.ds.getNodes().subscribe(nodes => console.log(this.nodes = nodes))
  }

}
