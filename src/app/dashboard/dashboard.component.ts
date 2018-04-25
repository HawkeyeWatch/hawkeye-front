import { Component, OnInit, TemplateRef } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { DataService } from "../data.service";
import { LocalNode } from "../models/node";
import { Deploy } from '../models/deploy';
import { DeployState } from "../models/deploy-state";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  modalRef: BsModalRef;
  nodes: LocalNode[];
  chosenNodeIndex: number;
  error: string;
  newNode = new LocalNode();
  creationDone = false;
  hostname: string;

  constructor(
    private ds: DataService,
    private modalService: BsModalService
  ) { }

  ngOnInit() {
    this.getNodes();
    this.hostname = window.location.hostname;
  }

  getNodes() {
    this.ds.getNodes().subscribe((nodes: LocalNode[]) => console.log(this.nodes = nodes));
  }

  openModalDelete(m: TemplateRef<any>, i: number) {
    this.chosenNodeIndex = i;
    this.modalRef = this.modalService.show(m);
  }

  deleteChosenNode() {
    this.ds.deleteNode(this.nodes[this.chosenNodeIndex]._id)
      .subscribe((res: any) => {
        if (res.error) {
          return this.error = res.error;
        }
        if (res.success) {
          this.nodes.splice(this.chosenNodeIndex, 1);
          this.modalRef.hide();
        }
      }, (err) => {
        this.error = err.error;
      });
  }

  openModal(m: TemplateRef<any>) {
    this.newNode = new LocalNode();
    this.error = '';
    this.creationDone = false;
    this.modalRef = this.modalService.show(m);
  }

  createNode() {
    this.ds.createNode(this.newNode)
      .subscribe((res: {error: string, success: string, node: LocalNode}) => {
        if (res.error) {
          return this.error = res.error;
        }
        if (res.success) {
          this.creationDone = true;
          this.nodes.push(res.node);
          this.newNode = res.node;
          this.newNode.link = `jstp://${this.newNode.jstpLogin}:${this.newNode.jstpPassword}@${this.hostname}:3228`;
        }
      }, (err) => {
        this.error = err.error;
      });
  }
  addNode() {
    this.ds.addNode(this.newNode)
      .subscribe((res: {error: string, success: string, node: LocalNode}) => {
        if (res.error) {
          return this.error = res.error;
        }
        if (res.success) {
          console.log(res);
          this.closeModal();
          this.nodes.push(res.node);
        }
      }, (err) => {
        this.error = err.error;
      });
  }

  updateDeployState(node: LocalNode, deploy: Deploy) {
    this.ds.getDeploy(node._id, deploy._id)
    .subscribe(
      (res: Deploy) => {deploy.status = res.status.map(a => {a.lastState = DeployState[a.lastState];return a})},
      (err) => {console.error(err)}
    )
  }

  stopDeploy(node: LocalNode, deploy: Deploy) {
    this.ds.stopDeploy(node._id, deploy._id)
    .subscribe(
      (res: Deploy) => {deploy.status = res.status.map(a => {a.lastState = DeployState[a.lastState];return a})},
      (err) => {console.error(err)}
    )
  }

  startDeploy(node: LocalNode, deploy: Deploy) {
    this.ds.startDeploy(node._id, deploy._id)
    .subscribe(
      (res: Deploy) => {deploy.status = res.status.map(a => {a.lastState = DeployState[a.lastState];return a})},
      (err) => {console.error(err)}
    )
  }

  fetchDeploy(node: LocalNode, deploy: Deploy) {
    this.ds.fetchDeploy(node._id, deploy._id)
    .subscribe(
      (res: Deploy) => {deploy.status = res.status.map(a => {a.lastState = DeployState[a.lastState];return a})},
      (err) => {console.error(err)}
    )
  }

  openNode(ind: number, event: any) {
    if (event) {
      const node: LocalNode = this.nodes[ind];
      node.deploys.forEach((deploy) => {
        this.updateDeployState(node, deploy);
      });
    }
  }
  closeModal() {
    this.creationDone = false;
    this.modalRef.hide();
  }
}
