import {Component, Input, ElementRef, AfterContentInit} from '@angular/core';

import helpers = require('../shared/helpers');
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/stacked-barchart.component.css';

@Component({
    selector: 'stacked-barchart',
    templateUrl: './stacked-barchart.component.html',
})
export class StackedBarChart implements AfterContentInit{
    @Input()
    results: any;

    public svg: any;


    constructor(private el: ElementRef) {
    }

    ngAfterContentInit() {
        this.createBarChart();
    }


    createBarChart() {

        this.svg = d3.select(this.el.nativeElement.firstElementChild)
            .append("svg");

        this.svg.attr("width", this.el.nativeElement.parentElement.offsetWidth * .9);
        this.svg.attr("height", 560);


        var margin = {top: 20, right: 20, bottom: 30, left: 40},
            width = +this.svg.attr("width") - margin.left - margin.right,
            height = +this.svg.attr("height") - margin.top - margin.bottom,
            g = this.svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var x = d3.scaleBand()
            .rangeRound([0, width])
            .padding(0.1)
            .align(0.1);

        var y = d3.scaleLinear()
            .rangeRound([height, 0]);

        var z = d3.scaleOrdinal()
            .range(["green", "red", "goldenrod"])
            //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var stack = d3.stack();

        let data: Array<any> = this.results;

        let keys: Array<any> = this.getKeys(data[0]);

        for(var i = 0; i < data.length; i++) {
            data[i] = this.type(data[i], keys);
        }


        data.sort(function (a, b) {
            return b["total"] - a["total"];
        });

        x.domain(data.map(function (d) {
            return d["keyword"];
        }));
        y.domain([0, d3.max(data, function (d) {
            return d["total"];
        })]).nice();

        z.domain(keys.slice(1));

        g.selectAll(".serie")
            .data(stack.keys(keys.slice(1))(data))
            .enter().append("g")
            .attr("class", "serie")
            .attr("fill", function (d) {
                return z(d.key);
            })
            .selectAll("rect")
            .data(function (d) {
                return d;
            })
            .enter().append("rect")
            .attr("x", function (d) {
                return x(d.data["keyword"]);
            })
            .attr("y", function (d) {
                return y(d[1]);
            })
            .attr("height", function (d) {
                return y(d[0]) - y(d[1]);
            })
            .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(y).ticks(10, "s"))
            .append("text")
            .attr("x", 2)
            .attr("y", y(y.ticks(10).pop()))
            .attr("dy", "0.35em")
            .attr("text-anchor", "start")
            .attr("fill", "#000")
            .text("Keyword Count");

        var legend = g.selectAll(".legend")
            .data(keys.slice(1).reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("font", "10px sans-serif");

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return d;
            });
    }

    type(d, columns) {
        var i, t;
        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]];
        d["total"] = t;
        return d;
    }

    getKeys(obj) {
        var keys = [];
        for(var k in obj) keys.push(k);
        return keys;
    }
}