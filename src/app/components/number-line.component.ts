import {Component, Input, ElementRef, AfterContentInit} from '@angular/core';

import helpers = require('../shared/helpers');
import * as d3 from 'd3';

import '../../public/styles/styles.css';
//import '../../public/styles/number-line.component.css';

@Component({
    selector: 'number-line',
    templateUrl: './number-line.component.html',
})
export class NumberLine implements AfterContentInit{
    @Input()
    results: any;

    public svg: any;


    constructor(private el: ElementRef) {
    }

    ngAfterContentInit() {
        this.createNumberLine();
    }


    createNumberLine() {

        this.svg = d3.select(this.el.nativeElement.firstElementChild)
            .append("svg");

        this.svg.attr("width", this.el.nativeElement.parentElement.offsetWidth);
        this.svg.attr("height", 200);


        var margin = {top: 20, right: 20, bottom: 30, left: 70},
            width = +this.svg.attr("width") - margin.left - margin.right,
            height = +this.svg.attr("height") - margin.top - margin.bottom;

        var x = d3.scaleLinear()
            .domain([-1, 1])
            .range([0, width]);

        var xAxis = d3.axisTop(x);


        x.domain([-1, 1]);

        this.svg.append("g")
            .attr("class", "axis--x")
            .attr("transform", "translate(30,100)")
            .call(xAxis.ticks(5))
            .selectAll("rect")
            .data(this.results)
            .enter()
            .append("rect")
            .attr("transform", "translate(0,-70)")
            .attr("fill", function(d) {
                if(d > 0)
                    return "green";
                else if(d < 0)
                    return "red";
                else
                    return "goldenrod";
            })
            .attr("x", function (d) {
                if(d > 0)
                    return x(0);
                else if(d < 0)
                    return x(d);
                else
                    return x(-.01);
            })
            .attr("y", 20)
            .attr("width", function (d) {
                if(d > 0)
                    return x(d) - x(0);
                else if(d < 0)
                    return x(0) - x(d);
                else
                    return x(-.98);
            })
            .attr("height", 30);
    }
}