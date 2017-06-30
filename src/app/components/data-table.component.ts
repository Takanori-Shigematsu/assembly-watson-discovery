import {Component, Input, AfterContentInit} from '@angular/core';
import { DataTableResource } from 'angular-2-data-table';

import '../../public/styles/styles.css';
import '../../public/styles/data-table.component.css';


@Component({
    selector: 'product-data-table',
    templateUrl: './data-table.component.html',
})
export class ProductDataTable implements AfterContentInit {

    @Input()
    products:any;

    itemResource;
    items = [];
    itemCount = 0;

    constructor() {
    }

    ngOnInit() {
        this.itemResource = new DataTableResource(this.products);
        this.items = [];
        this.itemCount = 0;
        this.itemResource.count().then(count => this.itemCount = count);


    }
    ngAfterContentInit() {
    }

    reloadItems(params) {
        this.itemResource.query(params).then(items => this.items = items);
    }

    // special properties:

    rowClick(rowEvent) {
        console.log('Clicked: ' + rowEvent.row.item.name);
    }

    rowDoubleClick(rowEvent) {
        alert('Double clicked: ' + rowEvent.row.item.name);
    }

    rowTooltip(item) { return item.jobTitle; }
}