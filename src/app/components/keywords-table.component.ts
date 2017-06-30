import {Component, Input, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationInstance} from 'ng2-pagination';

import helpers = require('../shared/helpers');
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/reviews.component.css';

@Component({
    selector: 'keywords-table',
    templateUrl: './keywords-table.component.html',
})
export class KeywordsTable implements OnChanges {
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

        id: 'keywords-pagination',

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
            jsonObj["keywords"] = [];
            jsonObj["opened"] = true;

            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["keywords"].length > 0) {
                jsonObj["doc_sentiment"]["type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                jsonObj["doc_sentiment"]["score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                jsonObj["doc_emotions"] = data[i]["review_text_enriched"]["docEmotions"];

                var doc = data[i]["review_text_enriched"]["keywords"];
                for (var j = 0; j < doc.length; j++) {
                    var keyword = {
                        "text": null,
                        "relevance": null,
                        "sentiment": {
                            "type": null,
                            "score": null
                        }
                    };

                    var obj = doc[j];

                    keyword["text"] = obj["text"];
                    keyword["relevance"] = obj["relevance"];
                    keyword["sentiment"]["type"] = obj["sentiment"]["type"];

                    if (obj["sentiment"]["score"])
                        keyword["sentiment"]["score"] = obj["sentiment"]["score"];

                    jsonObj["keywords"].push(keyword);

                }
                this.reviews.push(jsonObj);
            }

        }

    }
}