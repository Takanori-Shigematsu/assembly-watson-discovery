import {Component, DoCheck} from '@angular/core';
import '../../public/styles/styles.css';
import {QueryService} from '../services/query.service';

import constants = require('../shared/constants');


@Component({
    selector: 'review-overview',
    templateUrl: './review-overview.component.html',
    styleUrls: ['../app.component.css'],
    providers: [QueryService]
})
export class ReviewOverview implements DoCheck {
    public showProductsOverview = false;
    public bubbleChartResults: any = null;
    public productResults: any = null;
    public reviewTimeline: any = null;

    public productOpened: boolean = true;
    public bubbleOpened: boolean = true;
    public reviewTimelineOpened: boolean = true;

    private positiveLoaded = false;
    private negativeLoaded = false;
    private neutralLoaded = false;
    private bubbleLoaded = false;
    private productResultsLoaded = false;
    private reviewTimelineLoaded = false;


    constructor(private queryService: QueryService) {
    }


    ngOnInit() {
        $("#watson-overlay").removeClass("hide");
        this.getBubbleChartData();
        this.getProducts();
        this.getReviewTimeline();
    }

    ngDoCheck() {
        if (this.bubbleLoaded && this.productResultsLoaded && this.reviewTimelineLoaded) {
            $("#watson-overlay").addClass("hide");
            this.showProductsOverview = true;
        }
    }

    toggleProduct() {
        this.productOpened = !this.productOpened;
    }

    toggleBubble() {
        this.bubbleOpened = !this.bubbleOpened;
    }

    toggleReviewTimeline() {
        this.reviewTimelineOpened = !this.reviewTimelineOpened;
    }

    getProducts() {
        this.queryService.query(constants.queries["product-review-counts"]).subscribe(
            data => {
                this.productResults = this.parseProducts(data.aggregations[0].results);
                this.productResultsLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getBubbleChartData() {
        this.queryService.query(constants.queries["bubble-chart"]).subscribe(
            data => {
                this.bubbleChartResults = this.parseBubbleChart(data.aggregations[0].aggregations[0].results);
                this.bubbleLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getReviewTimeline() {
        this.queryService.query(constants.queries["review-timeline"]).subscribe(
            data => {
                this.reviewTimeline = this.parseTimeline(data.aggregations[0].results);
                this.reviewTimelineLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    parseBubbleChart(data) {
        var result = [];

        var total = 0;
        for (var i in data) {
            var obj = data[i];
            var json = {"name": "", "count": "", "word": ""};

            json.name = obj["key"];
            json.count = obj["matching_results"];
            json.word = obj["key"];
            result.push(json);
        }

        return result;
    }

    parseProducts(data) {
        var result = [];

        var total = 0;
        for (var i in data) {
            var obj = data[i];
            var json = {"name": "", "count": ""};

            json.name = obj["key"];
            json.count = obj["matching_results"];
            result.push(json);
        }

        return result;
    }

    parseTimeline(data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var obj = {"date": data[i]["key"], "sentiment": data[i]["matching_results"]};

            result.push(obj);
        }

        return result;
    }

}