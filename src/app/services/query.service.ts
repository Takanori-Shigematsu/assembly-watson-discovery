import {Injectable, Inject} from '@angular/core';
import {Http, Response, URLSearchParams, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import constants = require('../shared/constants');
import helpers = require('../shared/helpers');


@Injectable()
export class QueryService {
    // private instance variable to hold base url

    private queryUrl:string;
    // Resolve HTTP using the constructor
    constructor(private http : Http) {
        this.queryUrl = constants.query_url
    }

    // Fetch all existing comments
    query(paramObj): Observable<any> {

        let params: URLSearchParams = new URLSearchParams();
        if(paramObj.query) {
            params.set('query', paramObj.query);

        }
        if(paramObj.count)
            params.set('count', paramObj.count);
        if(paramObj.filter) {
            params.set('filter', paramObj.filterUnits);
        }

        if(paramObj.aggregation) {
            params.set('aggregation', paramObj.aggregation);
        }
        if(paramObj.return)
            params.set('return', paramObj.return);

        // ...using get request
        return this.http.get(this.queryUrl, {search: params})
        // ...and calling .json() on the response to return data
            .map((res: Response) => res.json())
            //...errors if any
            .catch((error: any) => Observable.throw(error.json || 'Server error'));

    }

}