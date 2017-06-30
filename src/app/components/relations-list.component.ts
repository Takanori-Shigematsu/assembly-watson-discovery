import {Component, Input, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {PaginationInstance} from 'ng2-pagination';

import helpers = require('../shared/helpers');
import constants = require('../shared/constants');
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/reviews.component.css';

@Component({
    selector: 'relations-list',
    templateUrl: './relations-list.component.html',
})
export class RelationsList implements OnChanges {
    @Input()
    data: any;

    //this array contains the image we will show for each page
    relations: Array<any> = [];

    public noResults = false;
    public filter: string = '';
    public maxSize: number = 7;
    public directionLinks: boolean = true;
    public autoHide: boolean = false;
    public config: PaginationInstance = {

        id: 'advanced',

        itemsPerPage: 10,

        currentPage: 1
    };

    opened: Boolean = false;

    toggle(i) {
        var index = (this.config.currentPage * this.config.itemsPerPage) - (this.config.itemsPerPage - i);
        this.relations[index]["opened"] = !this.relations[index]["opened"];
    }

    constructor(private elRef: ElementRef, private sanitizer: DomSanitizer) {
    }


    onPageChange(number: number) {
        this.config.currentPage = number;
    }

    public ngAfterViewChecked() {
        (<any>$('[data-toggle="tooltip"]')).tooltip();
    }

    // ngAfterContentInit() {
    //     this.data.changes.subscribe(() => {
    //         // will be called every time an item is added/removed
    //     });
    // }


    ngOnChanges(changes: SimpleChanges) {
        if (this.data) {
            this.relations = [];

            this.parseData(this.data);
            (<any>$('[data-toggle="tooltip"]')).tooltip();

        }
        this.config.currentPage = 1;
        $("#watson-overlay").addClass("hide");

    }

    parseData(data) {
        for (var i = 0; i < data.length; i++) {
            var jsonObj = {};
            jsonObj["product_name"] = data[i]["product_name"];
            jsonObj["review_text"] = data[i]["review_text"];
            jsonObj["summary"] = data[i]["summary"];
            jsonObj["doc_sentiment"] = {};
            jsonObj["doc_emotions"] = {};
            jsonObj["relations"] = [];
            jsonObj["opened"] = true;

            if (data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["relations"].length > 0) {
                jsonObj["doc_sentiment"]["type"] = data[i]["review_text_enriched"]["docSentiment"]["type"];
                jsonObj["doc_sentiment"]["score"] = data[i]["review_text_enriched"]["docSentiment"]["score"] ? data[i]["review_text_enriched"]["docSentiment"]["score"] : null;
                jsonObj["doc_emotions"] = data[i]["review_text_enriched"]["docEmotions"];

                var doc = data[i]["review_text_enriched"]["relations"];
                for (var j = 0; j < doc.length; j++) {
                    var relation = doc[j];
                    var sentence = relation["sentence"];
                    var subject = relation["subject"] !== null && typeof relation["subject"] !== 'undefined' ? relation["subject"]["text"] : null;
                    var action = relation["action"] !== null && typeof relation["action"] !== 'undefined' ? relation["action"]["text"] : null;
                    var object = relation["object"] !== null && typeof relation["object"] !== 'undefined' ? relation["object"]["text"] : null;
                    var location = relation["location"] !== null && typeof relation["location"] !== 'undefined' ? relation["location"]["text"] : null;

                    if (subject) {
                        subject = helpers.escapeHTML(subject, constants.escape_characters, constants.escape_map);

                        var regSub = new RegExp('\\b(' + subject + ')\\b', 'g');

                        var html = this.createToolTip(relation["subject"], "goldenrod", subject);
                        sentence = sentence.replace(regSub, html);

                    }


                    if (action) {
                        action = helpers.escapeHTML(action, constants.escape_characters, constants.escape_map);

                        var regAction = new RegExp('\\b(' + action + ')\\b', 'g');

                        var html = this.createToolTip(relation["action"], "crimsom", action);
                        sentence = sentence.replace(regAction, html);

                    }

                    if (object) {
                        object = helpers.escapeHTML(object, constants.escape_characters, constants.escape_map);

                        var regObj = new RegExp('\\b(' + object + ')\\b', 'g');

                        var html = this.createToolTip(relation["object"], "darkblue", object);
                        sentence = sentence.replace(regObj, html);

                    }

                    if (location) {
                        location = helpers.escapeHTML(location, constants.escape_characters, constants.escape_map);

                        var regLoc = new RegExp('\\b(' + location + ')\\b', 'g');

                        var html = this.createToolTip(relation["location"], "darkviolet", location);
                        sentence = sentence.replace(regLoc, html);

                    }

                    jsonObj["relations"].push(this.sanitizer.bypassSecurityTrustHtml('<p class="sentence">' + sentence + '</p>'));
                }
                this.relations.push(jsonObj);
            }

        }

    }

    createToolTip(data, color, text) {
        if (data.sentiment) {
            var title = "<span>Sentiment Type: " + data.sentiment.type + "</span>";
            var template = "";


            if (data.sentimentFromSubject) {
                title += "<br/><span>Sentiment Subject Type: " + data.sentimentFromSubject.type + "</span>"
            }

            if (data.sentiment.type === 'positive')
                template += "<div class='tooltip' role='tooltip'><div class='tooltip-arrow green'></div><div class='tooltip-inner green'></div></div>";
            else
                template += "<div class='tooltip' role='tooltip'><div class='tooltip-arrow red'></div><div class='tooltip-inner red'></div></div>";

            return '<a class="' + color + '" data-toggle="tooltip" data-placement="top" data-html="true" title="' + title + '" data-template="' + template + '"><b><u>' + text + '</u></b></a>';

        } else
            return '<span class="' + color + '"><b>' + text + '</b></span>';

    };

}