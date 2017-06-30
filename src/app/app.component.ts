import {Component, AfterViewInit} from '@angular/core';
import { Router } from '@angular/router';

import '../public/styles/styles.css';

import constants = require('./shared/constants');


@Component({
    selector: 'discovery-app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {

    constructor(private router:Router) {

    }

    ngAfterViewInit() {
        this.router.navigateByUrl("/home");
    }

}