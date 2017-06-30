'use strict';

export var query_url = window.location.href.split('#')[0] + "discovery/query";

export var escape_map = {
    '&': '\\&',
    '<': '\\<',
    '>': '\\>',
    '"': '\\"',
    '?': '\\?',
    '[': '\\[',
    ']':'\\[',
    '^':'\\^',
    '$':'\\$',
    '.':'\\.',
    '|':'\\|',
    '*':'\\*',
    '+':'\\+',
    '{':'\\{',
    '}':'\\}',
    '(':'\\(',
    ')':'\\)',
    '~':'\\~'
};

export var escape_characters = /[&<>"?\[\]^$.|*+{}~()]/g;

export var queries = {
    "review-timeline": {
        "count": 1000,
        "aggregation": "timeslice(field:review_date,interval:1year)",
        "return": "aggregations"
    },
    "product-search": {
        "count": 1,
        "query": "product_name:%s"
    },
    "bubble-chart": {
        "count": 1000,
        "aggregation": "nested(review_text_enriched.keywords)" +
        ".term(review_text_enriched.keywords.text.raw,count:50)" +
        ".average(review_text_enriched.keywords.sentiment.score)",
        "return": "aggregations"
    },
    "product-review-counts": {
        "count": 1000,
        "aggregation": "term(product_name.raw,count:50)",
        "return": "aggregations"
    },
    "pie-chart-positive": {
        "count": 1000,
        "aggregation": "filter(review_text_enriched.docSentiment.type:positive)" +
        ".term(review_text_enriched.keywords.text.raw,count:15)",
        "return": "aggregations"
    },
    "pie-chart-negative":{
        "count": 1000,
        "aggregation": "filter(review_text_enriched.docSentiment.type:negative)" +
        ".term(review_text_enriched.keywords.text.raw,count:15)",
        "return": "aggregations"
    },
    "pie-chart-neutral": {
        "count": 1000,
        "aggregation": "filter(review_text_enriched.docSentiment.type:neutral)" +
        ".term(review_text_enriched.keywords.text.raw,count:15)",
        "return": "aggregations"
    },
    "sentiment-by-keywords": {
        "count": 1000,
        "aggregation": "filter(product_name:%s)" +
        ".nested(review_text_enriched.keywords)" +
        ".[filter(review_text_enriched.keywords.sentiment.type:positive).term(review_text_enriched.keywords.text.raw)" +
        ",filter(review_text_enriched.keywords.sentiment.type:negative).term(review_text_enriched.keywords.text.raw)" +
        ",filter(review_text_enriched.keywords.sentiment.type:neutral).term(review_text_enriched.keywords.text.raw)]",
        "return": "aggregations"
    },
    "product-sentiment": {
        "count": 1000,
        "aggregation": "filter(product_name:%s)" +
        ".[filter(review_text_enriched.docSentiment.type:positive)" +
        ",filter(review_text_enriched.docSentiment.type:negative)" +
        ",filter(review_text_enriched.docSentiment.type:neutral)]",
        "return": "aggregations"
    },
    "average-product-sentiment": {
        "count": 1000,
        "aggregation": "filter(product_name:%s).average(review_text_enriched.docSentiment.score)",
        "return": "aggregations"
    },
    "product-sentiment-timeline": {
        "count": 1000,
        "aggregation": "filter(product_name:%s).timeslice(field:review_date,interval:1year).average(review_text_enriched.docSentiment.score)",
        "return": "aggregations"
    }
};
