import {Component, ViewChild} from '@angular/core';
import '../../public/styles/styles.css';
import {QueryService} from '../services/query.service';

import * as d3 from 'd3';

import constants = require('../shared/constants');
import helpers = require('../shared/helpers');

@Component({
    selector: 'enrichment-visualizer',
    templateUrl: './enrichment-visualizer.component.html',
    styleUrls: ['../app.component.css'],
    providers: [QueryService]
})
export class EnrichmentVisualizer {
    @ViewChild('start') start;

    public results: any = null;

    public selected: any = null;
    public relations: string = "RELATIONS";
    public concepts: string = "CONCEPTS";
    public entities: string = "ENTITIES";
    public keywords: string = "KEYWORDS";

    public csvResults: any = {"concepts": [], "entities": [], "relations": [], "keywords": []};


    constructor() {}

    onReceiveResult($event) {
        this.results = null;
        if($event["results"] !== undefined && $event["results"].length > 0) {
            this.results = $event["results"];
            this.selected = this.relations;
        } else {
            $("#watson-overlay").addClass("hide");
            this.results = [];
        }


    }

    ngOnInit() {
        (<any>$('[data-toggle="popover"]')).popover({ container: 'body' });
    }

    showRelations() {
        this.selected = this.relations;
    };

    showConcepts() {
        this.selected = this.concepts;
    };

    showEntities() {
        this.selected = this.entities;
    };

    showKeywords() {
        this.selected = this.keywords;
    };

    convertToCSV(data) {
        for (var i = 0; i < data.length; i++) {
            //concepts
            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["concepts"].length > 0) {
                var doc = data[i]["review_text_enriched"]["concepts"];
                for (var j = 0; j < doc.length; j++) {
                    var obj = doc[j];

                    var jsonObj = {};

                    jsonObj["product_name"] = data[i]["product_name"];
                    jsonObj["review_text"] = data[i]["review_text"];
                    jsonObj["summary"] = data[i]["summary"];
                    jsonObj["doc_sentiment_type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                    jsonObj["doc_sentiment_score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                    jsonObj["concept_text"] = obj["text"];
                    jsonObj["concept_relevance"] = obj["relevance"];
                    jsonObj["concept_references"] = [];

                    if (obj["dbpedia"])
                        jsonObj["concept_references"].push(obj["dbpedia"]);
                    if (obj["freebase"])
                        jsonObj["concept_references"].push(obj["freebase"]);

                    if (obj["opencyc"])
                        jsonObj["concept_references"].push(obj["opencyc"]);

                    if (obj["yago"])
                        jsonObj["concept_references"].push(obj["yago"]);

                    if (obj["website"])
                        jsonObj["concept_references"].push(obj["website"]);

                    if (obj["crunchbase"])
                        jsonObj["concept_references"].push(obj["crunchbase"]);

                    this.csvResults["concepts"].push(jsonObj);

                }
            }

            //entities
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

                    this.csvResults["entities"].push(jsonObj);

                }
            }

            //keywords
            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["keywords"].length > 0) {
                let doc = data[i]["review_text_enriched"]["keywords"];
                for (var j = 0; j < doc.length; j++) {
                    var obj = doc[j];

                    var jsonObj = {};

                    jsonObj["product_name"] = data[i]["product_name"];
                    jsonObj["review_text"] = data[i]["review_text"];
                    jsonObj["summary"] = data[i]["summary"];
                    jsonObj["doc_sentiment_type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                    jsonObj["doc_sentiment_score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                    jsonObj["keyword_text"] = obj["text"];
                    jsonObj["keyword_relevance"] = obj["relevance"];
                    jsonObj["sentiment_score"] = obj["sentiment"]["score"];
                    jsonObj["sentiment_type"] = obj["sentiment"]["type"];

                    this.csvResults["keywords"].push(jsonObj);
                }
            }

            //relations
            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["relations"].length > 0) {
                var doc = data[i]["review_text_enriched"]["relations"];
                for (var j = 0; j < doc.length; j++) {
                    var relation = doc[j];
                    var jsonObj = {};
                    jsonObj["product_name"] = data[i]["product_name"];
                    jsonObj["review_text"] = data[i]["review_text"];
                    jsonObj["summary"] = data[i]["summary"];
                    jsonObj["doc_sentiment_type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                    jsonObj["doc_sentiment_score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                    jsonObj["relation_sentence"] = relation["sentence"];
                    jsonObj["relation_sentence_subject"] = relation["subject"] ? relation["subject"]["text"] : "N/A";
                    jsonObj["relation_sentence_action"] = relation["action"] ? relation["action"]["text"] : "N/A";
                    jsonObj["relation_sentence_object"] = relation["object"] ? relation["object"]["text"] : "N/A";
                    jsonObj["relation_sentence_location"] = relation["location"] ? relation["location"]["text"] : "N/A";

                    this.csvResults["relations"].push(jsonObj);
                }
            }

        }
    }

    downloadAsCSV() {
        if(this.results) {
            this.convertToCSV(this.results);
            var concepts = d3.csvFormat(this.csvResults["concepts"]);
            var entities = d3.csvFormat(this.csvResults["entities"]);
            var keywords = d3.csvFormat(this.csvResults["keywords"]);
            var relations = d3.csvFormat(this.csvResults["relations"]);

            helpers.exportToCSV(concepts, "concepts-export.csv");
            helpers.exportToCSV(entities, "entities-export.csv");
            helpers.exportToCSV(keywords, "keywords-export.csv");
            helpers.exportToCSV(relations, "relations-export.csv");
        }


    }
}