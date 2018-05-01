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
  chosenDeployIndex: number;
  error: string;
  newNode = new LocalNode();
  newDeploy = new Deploy();
  creationDone = false;
  cretionInProgress = false;
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
    this.ds.getNodes().subscribe((nodes: LocalNode[]) => this.nodes = nodes);
  }

  openModalSelectNode(m: TemplateRef<any>, i: number) {
    this.newDeploy = new Deploy();
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
        console.log(err)
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
      (res: Deploy) => {
        deploy.status = res.status.map(a => {a.lastState = DeployState[a.lastState];return a});
        console.log(deploy)
      },
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

  createDeploy() {
    this.cretionInProgress = true;
    this.ds.createDeploy(this.nodes[this.chosenNodeIndex]._id, this.newDeploy)
    .subscribe(
      (res: any) => {
        if (res.error) {
          return this.error = res.error;
        }
        this.nodes[this.chosenNodeIndex].deploys.push(res.deploy);
        this.updateDeployState(this.nodes[this.chosenNodeIndex], res.deploy);
        this.closeModal();
        this.cretionInProgress = false;
      }, (err: any) => {
        if (err.error.error) {
          if (err.error.error.error) {
            this.error = err.error.error.error
            return;
          }
          this.error = err.error.error;
          return;
        }
        this.error = err.error;
        this.cretionInProgress = false;
      }
    )
  }

  openModalSelectDeploy(m: TemplateRef<any>, i: number, ind: number) {
    this.chosenNodeIndex = i;
    this.chosenDeployIndex = ind;
    this.modalRef = this.modalService.show(m);
  }
  deleteChosenDeploy() {
    this.ds.deleteDeploy(
      this.nodes[this.chosenNodeIndex]._id,
      this.nodes[this.chosenNodeIndex].deploys[this.chosenDeployIndex]._id
    )
    .subscribe((res: any) => {
      if (res.success) {
        this.nodes[this.chosenNodeIndex].deploys.splice(this.chosenDeployIndex, 1);
        this.closeModal();
      } else {
        this.error = res.error;
      }
    }, (err) => this.error = err.error);
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
