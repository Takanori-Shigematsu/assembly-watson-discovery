import {Component, Input, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationInstance} from 'ng2-pagination';

import helpers = require('../shared/helpers')
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/reviews.component.css';

@Component({
    selector: 'entities-table',
    templateUrl: './entities-table.component.html',
})
export class EntitiesTable implements OnChanges {
    @Input()
    data: any;

    //this array contains the image we will show for each page
    reviews: Array<any> = [];

    public noResults = false;
    public filter: string = '';
    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public config: PaginationInstance = {

        id: 'entities-pagination',

        itemsPerPage: 10,

        currentPage: 1
    };

    opened: Boolean = false;

    toggle(i) {
        var index = (this.config.currentPage * this.config.itemsPerPage) - (this.config.itemsPerPage - i);
        this.reviews[index]["opened"] = !this.reviews[index]["opened"];
    }

    constructor(private elRef: ElementRef, private sanitizer: DomSanitizer) {
    }


    onPageChange(number: number) {
        this.config.currentPage = number;
    }

    public ngAfterViewChecked() {
    }


    ngOnChanges(changes: SimpleChanges) {
        this.config.currentPage = 1;
        if (this.data) {
            this.reviews = [];
            this.parseData(this.data);

        }
        this.config.currentPage = 1;

    }

    parseData(data) {
        for (var i = 0; i < data.length; i++) {
            var jsonObj = {};
            jsonObj["product_name"] = data[i]["product_name"];
            jsonObj["review_text"] = data[i]["review_text"];
            jsonObj["summary"] = data[i]["summary"];
            jsonObj["doc_sentiment"] = {};
            jsonObj["entities"] = [];
            jsonObj["opened"] = true;

            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["entities"].length > 0) {
                jsonObj["doc_sentiment"]["type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                jsonObj["doc_sentiment"]["score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                jsonObj["doc_emotions"] = data[i]["review_text_enriched"]["docEmotions"];

                var doc = data[i]["review_text_enriched"]["entities"];
                for (var j = 0; j < doc.length; j++) {
                    var entity = {
                        "text": null,
                        "relevance": null,
                        "count": null,
                        "sentiment": {
                            "type": null,
                            "score": null
                        },
                        "type": null
                    };

                    var obj = doc[j];

                    entity["text"] = obj["text"];
                    entity["relevance"] = obj["relevance"];
                    entity["type"] = obj["type"];
                    entity["sentiment"]["type"] = obj["sentiment"]["type"];

                    if (obj["sentiment"]["score"])
                        entity["sentiment"]["score"] = obj["sentiment"]["score"];

                    jsonObj["entities"].push(entity);

                }
                this.reviews.push(jsonObj);
            }

        }

    }

    convertToCSV(data) {
        var csvReviews = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["entities"].length > 0) {
                var doc = data[i]["review_text_enriched"]["entities"];
                for (var j = 0; j < doc.length; j++) {
                    var obj = doc[j];

                    var jsonObj = {};

                    jsonObj["product_name"] = data[i]["product_name"];
                    jsonObj["review_text"] = data[i]["review_text"];
                    jsonObj["summary"] = data[i]["summary"];
                    jsonObj["doc_sentiment_type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                    jsonObj["doc_sentiment_score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                    jsonObj["entity_text"] = obj["text"];
                    jsonObj["entity_relevance"] = obj["relevance"];
                    jsonObj["entity_type"] = obj["type"];
                    jsonObj["sentiment_score"] = obj["sentiment"]["score"];
                    jsonObj["sentiment_type"] = obj["sentiment"]["type"];

                    csvReviews.push(jsonObj);

                }
            }

        }

        return csvReviews;
    }


    downloadAsCSV() {
        var csvFile = d3.csvFormat(this.convertToCSV(this.data));
        helpers.exportToCSV(csvFile, "entities-export.csv");

    }

}