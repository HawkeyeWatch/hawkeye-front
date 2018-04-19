import { Deploy } from "./deploy";

export class LocalNode {
    _id: string;
    title: string;
    deploys: Deploy[];
    jstpLogin: string;
    isConnected: boolean;
    link: string;
    jstpPassword: string;
}