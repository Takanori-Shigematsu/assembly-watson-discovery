import {Component, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import {QueryService} from '../services/query.service';
import '../../public/styles/styles.css';

@Component({
    selector: 'query-form',
    templateUrl: './query-form.component.html',
    providers: [QueryService]
})

export class QueryForm {
    // Constructor
    constructor(private queryService: QueryService, private elRef: ElementRef) {}

    @Output() resultChange = new EventEmitter();

    form = {
        query: "Cuisinart Ice Cream Maker",
        count: "5",
        filter: "positive"
    };

    ngOnInit() {
        var storedParams = JSON.parse(localStorage.getItem('query-params'));
        if( storedParams && {} != storedParams ) {
            this.form = storedParams;
        }
        this.onSubmit();
    }

    onSubmit() {
        $("#watson-overlay").removeClass("hide");
        var params = {
            "query": this.form.query,
            "count": this.form.count,
            "filter": this.form.filter
        };

        localStorage.setItem('query-params', JSON.stringify(params));

        this.queryService.query(params).subscribe(
            data => {
                this.resultChange.emit(data);
            }, err => {
                console.log(err);
            }
        )
    }

}
