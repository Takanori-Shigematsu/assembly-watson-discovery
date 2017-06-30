/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var extend = require('extend');
var DiscoveryV1 = require('watson-developer-cloud');

var discovery = DiscoveryV1.discovery({
  username: process.env.DISCOVERY_USERNAME,
  password: process.env.DISCOVERY_PASSWORD,
  version: 'v1',
  version_date: '2016-12-01'
});

module.exports = {
  /**
   * Gets collections from discovery environment.
   * @param  {Object}   req
   * @param  {Object}   res
   * @param  {Function} callback The callback
   * @return {Object}   data
   */
  getCollections: function(req, res, callback) {
      var version_date = discovery.version_date;
      var environment_id = process.env.DISCOVERY_ENVIRONMENT_ID;

      discovery.getCollections({
          version_date: version_date,
          environment_id: environment_id
        },
        (err, data) => {
          console.log(err);
          if (err) {
            return res.status(err.code || 500).json(err);
          }

          return res.json(data);
        }
      );
   },

   /**
    * Queries documents in a given collection.
    * @param  {Object}   req
    * @param  {Object}   res
    * @param  {Function} callback The callback
    * @return {Object}   data
    */
  query: function(req, res, callback) {
    var version_date = discovery.version_date;
    var environment_id = process.env.DISCOVERY_ENVIRONMENT_ID;
    var collection_id = process.env.DISCOVERY_COLLECTION_ID;

    discovery.query({
        version_date: version_date,
        environment_id: environment_id,
        collection_id: collection_id,
        query: req.query.query && req.query.query.length > 0 ? req.query.query : null,
        filter: req.query.filter? req.query.filter : null,
        aggregation: req.query.aggregation? req.query.aggregation : null,
        count: req.query.count && req.query.count > 0 ? req.query.count : null,
        offset: req.query.offset? req.query.offset : null,
        return: req.query.return? req.query.return : null

      },
      (err, data) => {
        if (err) {
          console.log("Error: ");
          console.log(err);
          return res.status(err.code || 500).json(err);
        }

        return res.json(data);
      }
    );
  }
}
