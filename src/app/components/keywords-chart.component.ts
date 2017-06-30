import {Component, Input, AfterViewInit, ElementRef, SimpleChanges, OnChanges} from '@angular/core';
import * as d3 from 'd3';

import '../../public/styles/styles.css';
import '../../public/styles/keywords-chart.component.css';


@Component({
    selector: 'keywords-chart',
    templateUrl: './keywords-chart.component.html',
})
export class KeywordsChart implements /*AfterViewInit,*/ OnChanges {
    @Input() data: any;

    constructor(private element: ElementRef) {
    }

    keywords: any = [];
    labelArea: number = 160;
    host: any = null;
    chart: any = null;
    width: number = 400;
    bar_height: number = 20;
    height: number = null; //this.bar_height * 3;
    rightOffset: number = this.width + this.labelArea;

    lCol: string = "relevance";
    rCol: string = "sentiment";
    xFrom = d3.scaleLinear().range([0, this.width - 100]);
    xTo = d3.scaleLinear().range([0, this.width - 100]);
    y = null;

    // ngAfterViewInit() {
    //     this.setupData(this.data);
    //     this.host = d3.select(this.element.nativeElement.children[0]);
    //     this.setup(this.keywords);
    //     this.render(this.keywords);
    // }

    ngOnChanges(changes: SimpleChanges) {
        this.setupData(this.data);
        this.element.nativeElement.children[0].children
        let node = this.element.nativeElement.children[0];
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        this.host = d3.select(this.element.nativeElement.children[0]);

        this.setup(this.keywords);
        this.render(this.keywords);

    }

    setupData(data) {
        this.keywords = [];
        for (let i = 0; i < data.length; i++) {
            if(data[i]["review_text_enriched"] && data[i]["review_text_enriched"]["keywords"].length > 0) {
                let words = data[i]["review_text_enriched"]["keywords"];
                for (let j = 0; j < words.length; j++) {
                    let kw = {
                        "keyword": words[j]["text"],
                        "relevance": words[j]["relevance"],
                        "sentiment": words[j]["sentiment"] !== undefined && words[j]["sentiment"]["score"] !== undefined ? Math.abs(words[j]["sentiment"]["score"]) : 0,
                        "type": words[j]["sentiment"]["type"]
                    };

                    this.keywords.push(kw);

                }
            }

        }
    }

    setup(data) {
        var height = data.length * 2;
        this.height = this.bar_height * height;
        this.y = d3.scaleBand().range([20, this.height]);
    }

    render(data) {
        //this.element.nativeElement
        this.chart = this.host
            .append('svg')
            .attr('class', 'chart')
            .attr('width', this.labelArea + this.width + this.width)
            .attr('height', this.height);

        this.xFrom.domain(d3.extent(data, (d) => {
            return <number>d[this.lCol];
        }));

        this.xTo.domain(d3.extent(data, (d) => {
            return <number>d[this.rCol];
        }));

        this.y.domain(data.map((d) => {
            return d["keyword"];
        }));

        var yPosByIndex = (d) => {
            return this.y(d["keyword"]);
        };

        this.chart.selectAll("rect.left")
            .data(data)
            .enter().append("rect")
            .attr("x", (d) => {
                return this.width - this.xFrom(d[this.lCol]);
            })
            .attr("y", yPosByIndex)
            .attr("class", "left")
            .attr("width", (d) => {
                return this.xFrom(d[this.lCol]);
            })
            .attr("height", this.y.bandwidth());

        this.chart.selectAll("text.leftscore")
            .data(data)
            .enter().append("text")
            .attr("x", (d) => {
                return this.width - this.xFrom(d[this.lCol]) - 30;
            })
            .attr("y", (d) => {
                return <any>this.y(d["keyword"]) + <any>this.y.bandwidth() / 2;
            })
            .attr("dx", "20")
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'leftscore')
            .text((d) => {
                return d[this.lCol];
            });

        this.chart.selectAll("text.name")
            .data(data)
            .enter().append("text")
            .attr("x", (this.labelArea / 2) + this.width)
            .attr("y", (d) => {
                return <any>this.y(d["keyword"]) + <any>this.y.bandwidth() / 2;
            })
            .attr("dy", ".20em")
            .attr("text-anchor", "middle")
            .attr('class', 'name')
            .text((d) => {
                return d["keyword"];
            });

        this.chart.selectAll("rect.right")
            .data(data)
            .enter().append("rect")
            .attr("x", this.rightOffset)
            .attr("y", yPosByIndex)
            .attr("class", (d) => {
                var sentiment = d["type"] == "neutral"? "right-neutral" : d["type"] === "positive"? "right-positive" : "right-negative";
                return "right" + " " + sentiment;
            })
            .attr("width", (d) => {
                return this.xTo(d[this.rCol]);
            })
            .attr("height", this.y.bandwidth());

        this.chart.selectAll("text.score")
            .data(data)
            .enter().append("text")
            .attr("x", (d) => {
                let offset = d["type"] == "neutral"? this.rightOffset + 10 : this.rightOffset + 80;
                return <any>this.xTo(d[this.rCol]) + offset;
            })
            .attr("y", (d) => {
                return <any>this.y(d["keyword"]) + <any>this.y.bandwidth() / 2;
            })
            .attr("dx", -5)
            .attr("dy", ".36em")
            .attr("text-anchor", "end")
            .attr('class', 'score')
            .text((d) => {
                return d[this.rCol];
            });

        this.chart.append("text").attr("x", this.width / 3).attr("y", 10).attr("class", "title").text("Relevance");
        this.chart.append("text").attr("x", this.width / 3 + this.rightOffset).attr("y", 10).attr("class", "title").text("Sentiment");
        this.chart.append("text").attr("x", this.width + this.labelArea / 3).attr("y", 10).attr("class", "title").text("Keywords");

    }

}

