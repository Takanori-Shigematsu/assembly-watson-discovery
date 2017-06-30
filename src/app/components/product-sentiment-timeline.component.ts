import {Component, Input, ElementRef, AfterContentInit} from '@angular/core';

import helpers = require('../shared/helpers');
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/product-sentiment-timeline.component.css';

@Component({
    selector: 'product-sentiment-timeline',
    templateUrl: './product-sentiment-timeline.component.html',
})
export class ProductSentimentTimeline implements AfterContentInit {
    @Input()
    results: any;

    @Input()
    width: any;

    @Input()
    ylabel: any;

    public svg: any;


    private parseTime = d3.timeParse("%dd-%mm-%yyyy");
    private minDate = 0;
    private maxDate = 0;


    constructor(private el: ElementRef) {
    }

    ngAfterContentInit() {
        this.createTimeline();
    }


    createTimeline() {

        this.svg = d3.select(this.el.nativeElement.firstElementChild)
            .append("svg");

        var w = this.width? this.width:  this.el.nativeElement.parentElement.offsetWidth;
        this.svg.attr("width", w);
        this.svg.attr("height", 345);


        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = +this.svg.attr("width") - margin.left - margin.right,
            height = +this.svg.attr("height") - margin.top - margin.bottom,
            g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        //var parseTime = d3.timeParse("%dd-%mm-%yyyy");

        var x = d3.scaleTime()
            .rangeRound([0, width]);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var line = d3.line()
            .x(function (d) {
                return x(d["date"]);
            })
            .y(function (d) {
                return y(d["sentiment"]);
            });

        var data = this.results;


        for(var i = 0; i < data.length; i++) {
           this.type(data[i]);
        }



        x.domain([new Date(this.minDate), new Date(this.maxDate)]);
        y.domain(d3.extent(data, function (d) {
            return <number>d["sentiment"];
        }));

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", -40)
            .attr("dy", "0.71em")
            .style("text-anchor", "end")
            .text(this.ylabel);

        g.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
    }

    type(d) {
        if(this.minDate == 0 && this.maxDate == 0) {
            this.minDate = d["date"];
            this.maxDate = d["date"];
        } else if(d["date"] < this.minDate) {
            this.minDate = d["date"];
        } else if(d["date"] > this.maxDate) {
            this.maxDate = d["date"];
        }

        var date = new Date(d["date"]);
        var curr_date = date.getDate();
        var curr_month = date.getMonth() + 1; //Months are zero based
        var curr_year = date.getFullYear();

        var formattedDate = curr_date + "-" + curr_month + "-" + curr_year;

        d["date"] = <any>date;//this.parseTime(formattedDate);
        d["sentiment"] = +d.sentiment;
    }

}