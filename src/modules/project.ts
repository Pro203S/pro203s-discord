import * as fs from 'fs';
import { Environments } from '../types';

export default class Project {
    private _env!: Environments;

    constructor(
        private _dir: string
    ) { }

    async load() {
        
    }
}