import {Component, AfterViewInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, ElementRef} from '@angular/core';
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/bubble-chart.component.css';


import {QueryService} from '../services/query.service';

@Component({
    selector: 'bubble-chart',
    templateUrl: './bubble-chart.component.html',
    providers: [QueryService]
})
export class BubbleChart implements AfterViewInit {


    @Input()
    data:any;

    @Output() resultChange = new EventEmitter();

    output: number = 0;
    force:any;

    form = {
        jitter: .5
    };

    constructor(private queryService: QueryService) {
    }

    ngAfterViewInit() {
        this.setupBubble();
    }

    submitKeywordQuery(word) {
        $("#watson-overlay").removeClass("hide");
        var params = {
            "query": word
        };

        this.queryService.query(params).subscribe(
            data => {
                this.resultChange.emit(data);
            }, err => {
                console.log(err);
            }
        )
    }

    plotData = function (selector, data, plot) {
        return d3.select(selector).datum(data).call(plot);
    };

    setupBubble(){
        var display, plot, text;
        plot = this.bubbles();

        return this.plotData("#vis", this.data, plot);


    }

    bubbles() {
        var chart, clear, click, collide, collisionPadding, connectEvents, data, gravity, hashchange, height, idValue, jitter, label, margin, maxRadius, minCollisionRadius, mouseout, mouseover, node, rScale, rValue, textValue, tick, transformData, update, updateActive, updateLabels, updateNodes, width;
        width = $("#vis").width();
        height = 510;
        data = [];
        node = null;
        label = null;
        var self = this;
        margin = {
            top: 5,
            right: 0,
            bottom: 0,
            left: 0
        };
        maxRadius = 65;
        rScale = d3.scaleSqrt().range([0, maxRadius]);
        rValue = function (d) {
            return parseInt(d.count);
        };
        idValue = function (d) {
            return d.name;
        };
        textValue = function (d) {
            return d.name;
        };
        collisionPadding = 4;
        minCollisionRadius = 12;
        jitter = .5;
        transformData = function (rawData) {
            rawData.forEach(function (d) {
                d.count = parseInt(d.count);
                return rawData.sort(function () {
                    return 0.5 - Math.random();
                });
            });
            return rawData;
        };

        tick = function (e) {
            var dampenedAlpha = .1;

            d3.selectAll(".bubble-node")
                .each(gravity(dampenedAlpha))
                .each(collide(jitter))
                .attr("transform", function (d) {
                    return "translate(" + d["x"] + "," + d["y"] + ")";
                });

            d3.selectAll(".bubble-label").style("left", function (d) {
                return ((margin.left + d["x"]) - d["dx"] / 2) + "px";
            }).style("top", function (d) {
                return ((margin.top + d["y"]) - d["dy"] / 2) + "px";
            });

        };


        // constants used in the simulation
        var center = {x: width / 2, y: height / 2};
        var forceStrength = 0.03;

        function charge(d) {
            return -forceStrength * Math.pow(d.radius, 2.0);
        }

        function dragstarted(d) {
            if (!d3.event.active) self.force.alphaTarget(0.3).restart();
            d.fx = d["x"];
            d.fy = d["y"];
        }

        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        function dragended(d) {
            if (!d3.event.active) self.force.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }


        chart = function (selection) {
            return selection.each(function (rawData) {
                var maxDomainValue, svg, svgEnter;
                data = transformData(rawData);
                maxDomainValue = d3.max(data, function (d) {
                    return rValue(d);
                });
                rScale.domain([0, maxDomainValue]);
                svg = d3.select(this).selectAll("svg").data([data]);
                svgEnter = svg.enter().append("svg");
                svg.attr("width", width + margin.left + margin.right);
                svg.attr("height", height + margin.top + margin.bottom);
                node = svgEnter.append("g").attr("id", "bubble-nodes").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
                node.append("rect").attr("id", "bubble-background").attr("width", width).attr("height", height).on("click", clear);
                label = d3.select(this).selectAll("#bubble-labels").data([data]).enter().append("div").attr("id", "bubble-labels");

                self.force = d3.forceSimulation()
                    .velocityDecay(0.2)
                    .on('tick', tick);

                update();
                //hashchange();
                //return d3.select(window).on("hashchange", hashchange);

                return;
            });
        };


        update = function () {
            data.forEach(function (d, i) {
                return d.forceR = Math.max(minCollisionRadius, rScale(rValue(d)));
            });
            self.force.nodes(data).restart();
            updateNodes();
            updateLabels();
        };
        updateNodes = function () {
            node = node.selectAll(".bubble-node").data(data, function (d) {
                return idValue(d);
            });
            node.exit().remove();
            return node.enter().append("a").attr("class", "bubble-node").attr("xlink:href", function (d) {
                return "#" + (encodeURIComponent(idValue(d)));
                // }).call(connectEvents).append("circle").attr("r", function (d) {
            }).call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)).call(connectEvents).append("circle").attr("r", function (d) {
                return rScale(rValue(d));
            });

        };
        updateLabels = function () {
            var labelEnter;
            label = label.selectAll(".bubble-label").data(data, function (d) {
                return idValue(d);
            });
            label.exit().remove();
            labelEnter = label.enter().append("a").attr("class", "bubble-label").attr("href", function (d) {
                return "#" + (encodeURIComponent(idValue(d)));
            }).call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended)).call(connectEvents);
            // }).call(connectEvents);
            labelEnter.append("div").attr("class", "bubble-label-name").text(function (d) {
                return textValue(d);
            });
            labelEnter.append("div").attr("class", "bubble-label-value").text(function (d) {
                return rValue(d);
            });
            label.style("font-size", function (d) {
                return Math.max(8, rScale(rValue(d) / 2)) + "px";
            }).style("width", function (d) {
                return 2.5 * rScale(rValue(d)) + "px";
            });
            labelEnter.append("span").text(function (d) {
                return textValue(d);
            }).each(function (d) {
                return d.dx = Math.max(2.5 * rScale(rValue(d)), this.getBoundingClientRect().width);
            }).remove();
            labelEnter.style("width", function (d) {
                return d.dx + "px";
            });
            return labelEnter.each(function (d) {
                return d.dy = this.getBoundingClientRect().height;
            });
        };
        gravity = function (alpha) {
            var ax, ay, cx, cy;
            cx = width / 2;
            cy = height / 2;
            ax = alpha / 8;
            ay = alpha;
            return function (d) {
                d.x += (cx - d.x) * ax;
                return d.y += (cy - d.y) * ay;
            };
        };
        collide = function (jitter) {
            return function (d) {
                return data.forEach(function (d2) {
                    var distance, minDistance, moveX, moveY, x, y;
                    if (d !== d2) {
                        x = d.x - d2.x;
                        y = d.y - d2.y;
                        distance = Math.sqrt(x * x + y * y);
                        minDistance = d.forceR + d2.forceR + collisionPadding;
                        if (distance < minDistance) {
                            distance = (distance - minDistance) / distance * jitter;
                            moveX = x * distance;
                            moveY = y * distance;
                            d.x -= moveX;
                            d.y -= moveY;
                            d2.x += moveX;
                            return d2.y += moveY;
                        }
                    }
                });
            };
        };
        connectEvents = function (d) {
            d.on("mouseover", mouseover);
            return d.on("mouseout", mouseout);
        };
        clear = function () {
            return location.replace("#");
        };
        click = function (d) {
            location.replace("#" + encodeURIComponent(idValue(d)));
            d3.event.preventDefault();
            hashchange();
            //return
        };
        hashchange = function () {
            var id;
            id = decodeURIComponent(location.hash.substring(1)).trim();
            return updateActive(id);
        };
        updateActive = function (id) {
            node.classed("bubble-selected", function (d) {
                return id === idValue(d);
            });

            if(id.length > 0) {
                self.submitKeywordQuery(id);
            }
            // if (id.length > 0) {
            //     return d3.select("#status").html("<h3>The word <span class=\"active\">" + id + "</span> is now active</h3>");
            // } else {
            //     return d3.select("#status").html("<h3>No word is active</h3>");
            // }
        };
        mouseover = function (d) {
            return node.classed("bubble-hover", function (p) {
                return p === d;
            });
        };
        mouseout = function (d) {
            return node.classed("bubble-hover", false);
        };
        chart.jitter = function (_) {
            if (!arguments.length) {
                return jitter;
            }
            jitter = _;
            //self.force.restart();
            return chart;
        };
        chart.height = function (_) {
            if (!arguments.length) {
                return height;
            }
            height = _;
            return chart;
        };
        chart.width = function (_) {
            if (!arguments.length) {
                return width;
            }
            width = _;
            return chart;
        };
        chart.r = function (_) {
            if (!arguments.length) {
                return rValue;
            }
            rValue = _;
            return chart;
        };

        return chart;
    }

}