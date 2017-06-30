import {Component, DoCheck} from '@angular/core';
import '../../public/styles/styles.css';
import {QueryService} from '../services/query.service';

import constants = require('../shared/constants');
import helpers = require('../shared/helpers');
import * as sprintf from 'sprintf-js';

@Component({
    selector: 'product-search',
    templateUrl: './product-search.component.html',
    providers: [QueryService],
    host: {
        '(window:resize)': 'onResize($event)'
    }
})
export class ProductSearch implements DoCheck {

    public product;
    public pieChartResults;
    public sentimentByKeywordResults: any;
    public averageSentiment: any;
    public sentimentTimeline: any;

    public showProductsOverview = false;
    private positiveLoaded = false;
    private sentimentKeywordLoaded = false;
    private averageSentimentLoaded = false;
    private sentimentTimelineLoaded = false;

    private noResults = false;



    form = {
        product: ""
    };

    constructor(private queryService: QueryService) {
    }

    onResize(event) {
        console.log(event.target.innerWidth);
        console.log(this);
    }

    ngOnInit() {
        var product = localStorage.getItem('product-search');
        if(product) {
            this.form.product = product;
            this.product = product;
            product = helpers.escapeHTML(product, /['"(),*:~^<>]/g, constants.escape_map);
            this.getPieChartData(product);
            this.getSentimentByKeyword(product);
            this.getAverageSentiment(product);
            this.getSentimentTimeline(product);  
        }
    }

    autoComplete(searchTerm) {
        var datalist = $("#queryResults");

        this.queryService.query({ "query": searchTerm, "aggregation": "term%28product_name%29" }).subscribe(
            data => {
                var suggestions = [];
                var results = data.aggregations[0].results;

                if(results.length > 0) {
                    datalist.empty();

                    results.forEach(function(aggregation) {
                        suggestions.push(aggregation['key']);
                        var opt = $("<option></option>").attr("value", aggregation['key']);
                        datalist.append(opt);
                    });                   
                }
            }, err => {
                console.log(err);
            }
        );
    }

    searchProduct() {
        $("#watson-overlay").removeClass("hide");
        this.product = "";
        this.showProductsOverview = false;
        this.positiveLoaded = false;
        this.sentimentKeywordLoaded = false;
        this.averageSentimentLoaded = false;
        this.sentimentTimelineLoaded = false;
        this.noResults = false;

        $("svg").parent().html("");
        var escape_characters = /['"(),*:~^<>]/g;

        var count = constants.queries["product-search"]["count"];
        var formQuery = this.form.product.indexOf(":") > -1? this.form.product.substr(this.form.product.indexOf(":") + 1) : this.form.product;
        formQuery = helpers.escapeHTML(formQuery, escape_characters, constants.escape_map);
        var query = sprintf.sprintf(constants.queries["product-search"]["query"], formQuery);

        var param = {"count": count, "query": query};

        this.queryService.query(param).subscribe(
            data => {
                if(data.results.length > 0) {
                    this.product = data.results[0].product_name;
                    localStorage.setItem('product-search', this.product);
                    var product = helpers.escapeHTML(this.product, escape_characters, constants.escape_map);
                    this.getPieChartData(product);
                    this.getSentimentByKeyword(product);
                    this.getAverageSentiment(product);
                    this.getSentimentTimeline(product);
                } else {
                    $("#watson-overlay").addClass("hide");
                    this.noResults = true;
                }
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getPieChartData(product) {
        var count = constants.queries["product-sentiment"]["count"];
        var aggregation = sprintf.sprintf(constants.queries["product-sentiment"]["aggregation"], product);
        var queryReturn = constants.queries["product-sentiment"]["return"];

        var query = {"count": count, "aggregation": aggregation, "return": queryReturn};

        this.queryService.query(query).subscribe(
            data => {
                var input;
                if (data.aggregations.length > 1) {
                    input = data.aggregations;
                } else if (data.aggregations[0].aggregations.length > 1) {
                    input = data.aggregations[0].aggregations;
                } else if (data.aggregations[0].aggregations[0].aggregations.length > 1) {
                    input = data.aggregations[0].aggregations[0].aggregations;
                } else
                    input = null;

                this.pieChartResults = this.parsePieChartResults(input);
                this.positiveLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getSentimentByKeyword(product) {
        var count = constants.queries["sentiment-by-keywords"]["count"];
        var aggregation = sprintf.sprintf(constants.queries["sentiment-by-keywords"]["aggregation"], product);
        var queryReturn = constants.queries["sentiment-by-keywords"]["return"];

        var query = {"count": count, "aggregation": aggregation, "return": queryReturn};

        this.queryService.query(query).subscribe(
            data => {
                var input;
                if (data.aggregations[0].results) {
                    input = data.aggregations;
                } else if (data.aggregations[0].aggregations[0].results) {
                    input = data.aggregations[0].aggregations;
                } else if (!data.aggregations[0].aggregations[0].aggregations[0].results) {
                    input = data.aggregations[0].aggregations[0].aggregations;
                } else
                    input = null;

                this.sentimentByKeywordResults = this.parseKeywords(input);
                this.sentimentKeywordLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getAverageSentiment(product) {
        var count = constants.queries["average-product-sentiment"]["count"];
        var aggregation = sprintf.sprintf(constants.queries["average-product-sentiment"]["aggregation"], product);
        var queryReturn = constants.queries["average-product-sentiment"]["return"];

        var query = {"count": count, "aggregation": aggregation, "return": queryReturn};

        this.queryService.query(query).subscribe(
            data => {
                var value = 0;
                if (data.aggregations[0] && data.aggregations[0].aggregations[0]) {
                    value = data.aggregations[0].aggregations[0].value;
                }
                this.averageSentiment = [value];
                this.averageSentimentLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    getSentimentTimeline(product) {
        var count = constants.queries["product-sentiment-timeline"]["count"];
        var aggregation = sprintf.sprintf(constants.queries["product-sentiment-timeline"]["aggregation"], product);
        var queryReturn = constants.queries["product-sentiment-timeline"]["return"];

        var query = {"count": count, "aggregation": aggregation, "return": queryReturn};

        this.queryService.query(query).subscribe(
            data => {
                var input;
                if (data.aggregations[0].results) {
                    input = data.aggregations;
                } else if (data.aggregations[0].aggregations[0].results) {
                    input = data.aggregations[0].aggregations;
                } else if (!data.aggregations[0].aggregations[0].aggregations[0].results) {
                    input = data.aggregations[0].aggregations[0].aggregations;
                } else
                    input = null;

                this.sentimentTimeline = this.parseTimeline(input[0].results);
                this.sentimentTimelineLoaded = true;
            }, err => {
                $("#watson-overlay").addClass("hide");
                console.log(err);
            }
        )
    }

    ngDoCheck() {
        if (this.positiveLoaded && this.sentimentKeywordLoaded && this.averageSentimentLoaded && this.sentimentTimelineLoaded) {
            if(this.pieChartResults.labels.length > 0 && this.sentimentByKeywordResults.length > 0
            && this.averageSentiment.length > 0 && this.sentimentTimeline.length > 0)
                this.showProductsOverview = true;
            else
                this.noResults = true;

            $("#watson-overlay").addClass("hide");
        }
    }

    parsePieChartResults(data) {
        var result = {
            "labels": [],
            "percentages": []
        };

        var total = 0;
        for (let i in data) {
            var obj = data[i];
            result.labels.push(obj["match"].split(":")[1]);
            result.percentages.push(obj["matching_results"]);
            total += obj["matching_results"];
        }

        for (let i in result.percentages) {
            result.percentages[i] /= total;
        }

        return result;
    }

    parseKeywords(data) {
        var result = [];
        var keywordDict = {}

        for (var i = 0; i < data.length; i++) {
            var sentiment = data[i].match.substr(data[i].match.indexOf(":") + 1);
            var keywords = data[i].aggregations[0].results;

            for (var j = 0; j < keywords.length; j++) {
                if (!keywordDict[keywords[j]["key"]]) {
                    keywordDict[keywords[j]["key"]] = {"positive": 0, "negative": 0, "neutral": 0};
                    keywordDict[keywords[j]["key"]][sentiment] += keywords[j]["matching_results"];
                } else {
                    keywordDict[keywords[j]["key"]][sentiment] += keywords[j]["matching_results"];
                }
            }
        }

        for (var k in keywordDict) {
            if (keywordDict.hasOwnProperty(k)) {
                result.push({
                    "keyword": k,
                    "positive": keywordDict[k]["positive"],
                    "negative": keywordDict[k]["negative"],
                    "neutral": keywordDict[k]["neutral"]
                })
            }
        }

        return result;

    }

    parseTimeline(data) {
        var result = [];

        for (var i = 0; i < data.length; i++) {
            var obj = {"date": data[i]["key"], "sentiment": data[i].aggregations[0]["value"]};

            result.push(obj);
        }

        return result;
    }
}