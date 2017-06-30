import {Component, ElementRef, AfterViewInit, AfterContentInit, Input} from '@angular/core';
import '../../public/styles/styles.css';
import '../../public/styles/pie-chart.component.css';
import * as d3 from 'd3';

@Component({
    selector: 'pie-chart',
    templateUrl: './pie-chart.component.html',
})
export class PieChart implements AfterContentInit, AfterViewInit {

    @Input()
    results: any;

    @Input()
    width: number;

    svg: any;
    svgOriginal: any;
    pie: any;
    key: any;
    arc: any;
    outerArc: any;
    radius: any;
    color: any;
    labels: any;
    percentages: any;

    constructor(private el: ElementRef) {

    }

    ngAfterViewInit() {
        this.change(this.randomData(this.labels, this.percentages), this.svg, this.pie, this.key, this.arc, this.outerArc, this.color, this.radius, this.results.labels, this.svgOriginal);

    }

    ngAfterContentInit() {
        this.createPieChart();
    }

    randomData(labels, percentages) {
        return labels.map(function (label, i) {
            return {label: label, value: percentages[i]}
        });
    }

    createPieChart() {
        this.svg = d3.select(this.el.nativeElement.firstElementChild)
            .append("svg");
            //.append("g");

        var width = this.width? this.width : this.el.nativeElement.firstElementChild.offsetWidth * .9, //800,
            height = 560;

        this.svg.attr("width", width);
        this.svg.attr("height", height);

        this.svgOriginal = this.svg;

        this.svg = this.svg.append("g");

        this.svg.append("g")
            .attr("class", "slices");
        this.svg.append("g")
            .attr("class", "labels");
        this.svg.append("g")
            .attr("class", "lines");



        this.radius = Math.min(width, height) / 2;

        this.pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return d["value"];
            });

        this.arc = d3.arc()
            .outerRadius(this.radius * 0.8)
            .innerRadius(this.radius * 0.4);

        this.outerArc = d3.arc()
            .innerRadius(this.radius * 0.9)
            .outerRadius(this.radius * 0.9);

        var transformWidth = this.width? width/2 + 50 : width/2;

        this.svg.attr("transform", "translate(" + transformWidth + "," + height / 2 + ")");

        this.key = function (d) {
            return d.data.label;
        };

        this.labels = this.results.labels; //["Lorem ipsum", "dolor sit", "amet", "consectetur", "adipisicing", "elit", "sed", "do", "eiusmod", "tempor", "incididunt"];

        this.percentages = this.results.percentages; //[.1, .2, .05, .2, .05, .1, .05, .05, .05, .1, .05];

        this.color = d3.scaleOrdinal(d3.schemeCategory20c).domain(this.labels)
            //.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

        var randomData = this.randomData;
        var labels = this.labels;
        var change = this.change;

        var svg = this.svg,
            svgOriginal = this.svgOriginal,
            pie = this.pie,
            key = this.key,
            arc = this.arc,
            outerArc = this.outerArc,
            color = this.color,
            radius = this.radius,
            percentages = this.percentages;

        this.change(randomData(labels, percentages), svg, pie, key, arc, outerArc, color, radius, labels, svgOriginal);

        // d3.select(".randomize")
        //     .on("click", function () {
        //         change(randomData(labels), svg, pie, key, arc, outerArc, color, radius);
        //     });

    }

    change(data, svg, pie, key, arc, outerArc, color, radius, labels, svgOriginal) {
        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);

        slice.enter()
            .insert("path")
            .style("fill", function (d) {
                return color(d.data.label);
            })
            .attr("class", "slice");

        slice
            .transition().duration(1000)
            .attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();

        /* ------- TEXT LABELS -------*/

        // var text = svg.select(".labels").selectAll("text")
        //     .data(pie(data), key);
        //
        // text.enter()
        //     .append("text")
        //     .attr("dy", ".35em")
        //     .text(function (d) {
        //         return (d.data.value * 100).toFixed(2) + "%" + " " + d.data.label;
        //     });
        //
        // function midAngle(d) {
        //     return d.startAngle + (d.endAngle - d.startAngle) / 2;
        // }
        //
        // text.transition().duration(1000)
        //     .attrTween("transform", function (d) {
        //         this._current = this._current || d;
        //         var interpolate = d3.interpolate(this._current, d);
        //         this._current = interpolate(0);
        //         return function (t) {
        //             var d2 = interpolate(t);
        //             var pos = outerArc.centroid(d2);
        //             pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
        //             return "translate(" + pos + ")";
        //         };
        //     })
        //     .styleTween("text-anchor", function (d) {
        //         this._current = this._current || d;
        //         var interpolate = d3.interpolate(this._current, d);
        //         this._current = interpolate(0);
        //         return function (t) {
        //             var d2 = interpolate(t);
        //             return midAngle(d2) < Math.PI ? "start" : "end";
        //         };
        //     });
        //
        // text.exit()
        //     .remove();

        // /* ------- SLICE TO TEXT POLYLINES -------*/
        //
        // var polyline = svg.select(".lines").selectAll("polyline")
        //     .data(pie(data), key);
        //
        // polyline.enter()
        //     .append("polyline");
        //
        // polyline.transition().duration(1000)
        //     .attrTween("points", function (d) {
        //         this._current = this._current || d;
        //         var interpolate = d3.interpolate(this._current, d);
        //         this._current = interpolate(0);
        //         return function (t) {
        //             var d2 = interpolate(t);
        //             var pos = outerArc.centroid(d2);
        //             pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
        //             return [arc.centroid(d2), outerArc.centroid(d2), pos];
        //         };
        //     });
        //
        // polyline.exit()
        //     .remove();

        var legend = svg.selectAll(".legend")
            .data(labels)
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate(0," + i * 20 + ")";
            })
            .style("font", "10px sans-serif");

        legend.append("rect")
            .attr("x", 80 - (svgOriginal.attr("width")/2))
            .attr("y", 45 - svgOriginal.attr("height")/2)
            .attr("width", 18)
            .attr("height", 18)
            .attr("fill", color);

        legend.append("text")
            .attr("x", 70 - (svgOriginal.attr("width")/2))
            .attr("y", 50 - svgOriginal.attr("height")/2)
            .attr("dy", ".35em")
            .attr("text-anchor", "end")
            .text(function (d) {
                return d;
            });
    };


}