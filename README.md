# Voice of the Customer Discovery [![Build Status](https://travis.ibm.com/watson-developer-cloud/voc-discovery.svg?token=p1iBXWqKFC4fGyYjjz9R&branch=master)](https://travis.ibm.com/watson-developer-cloud/voc-discovery)

This is a Starter Kit (SK), which is designed to get you up and running quickly with a common industry pattern, and to provide information and best practices around Watson services. This application was created to demonstrate how the services can be used to detect sentiment and customer's satisfaction based on different product reviews. This demo for this SK uses reviews of home and kitchen products on Amazon.

## **IMPORTANT NOTES:**
1. This Starter Kit works best on Chrome.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/devops/setup/deploy?repository=https://github.com/watson-developer-cloud/voc-discovery)

## Table of Contents
 - [Getting Started](#getting-started)
 - [Discovery Setup](#discovery-setup)
 - [Running locally](#running-locally)
 - [Deploying the application to Bluemix](#deploying)
 - [Adapting/Extending the Starter Kit](#adaptingextending-the-starter-kit)
 - [Troubleshooting](#troubleshooting)
 - [Reference information](#ref)


## <a name="getting-started"></a>Getting Started
### Prerequisites
 * A UNIX-based OS (or Cygwin)
 * Git
 * [Node.js](https://nodejs.org/#download) runtime, including the [npm][npm_link] package manager
 * A Bluemix account


1. You need a Bluemix account. If you don't have one, [sign up][sign_up].

2. Download and install the [Cloud-foundry CLI][cloud_foundry] tool if you haven't already.

3. Connect to Bluemix with the command line tool.

  ```sh
  cf api https://api.ng.bluemix.net
  cf login
  ```

## <a name="discovery-setup"></a>Discovery Setup
1. Create and retrieve service keys to access the [Discovery][service_url] service:
   (Note: If you are using a free trial plan, you will use 'free' in place of 'standard' in the following command)

  ```none
  cf create-service discovery standard my-discovery-service
  cf create-service-key my-discovery-service myKey
  cf service-key my-discovery-service myKey
  ```

2. Launch the Discovery tooling via Bluemix. On your first launch, the Discovery tooling will set up your environment.

3. Use the credentials that are returned in step 1 to retrieve `environment_id` from the list of environments:

  ```none
  curl -X GET -u <username>:<password> https://gateway.watsonplatform.net/discovery/api/v1/environments?version=2016-11-07
  ```

  Output:

  ```json
  {
    "environments": [
      {
        "environment_id": "<environment-id>",
        "name": "Watson News Environment",
        "description": "Watson News cluster environment",
        "created": "2017-02-13T17:32:40.771Z",
        "updated": "2017-02-13T17:32:40.771Z",
        "status": "active",
        "read_only": true
      },
      {
        "environment_id": "<environment-id>",
        "name": "byod",
        "description": "",
        "created": "2017-02-13T17:34:49.155Z",
        "updated": "2017-02-13T17:34:49.155Z",
        "status": "active",
        "read_only": false,
        "index_capacity": {
          "disk_usage": {
            "used_bytes": 0,
            "total_bytes": 2147483648,
            "used": "0 KB",
            "total": "2 GB",
            "percent_used": 0
          },
          "memory_usage": {
            "used_bytes": 462324640,
            "total_bytes": 1664811008,
            "used": "440.91 MB",
            "total": "1.55 GB",
            "percent_used": 27.77
          }
        }
      }
    ]
  }
  ```

4. Use `environment_id` for the byod environment retrieved from step 3 and replace with your id in the url. Upload the sample configuration file `discovery_config.json` with the command line tool and note down the `configuration_id` returned. The configuration is currently named `voc-config`, which can be changed if desired:

    ```sh
    curl -X POST \
    -u "{username}":"{password}" \
    -H "Content-Type: application/json" \
    -d @discovery_config.json "https://gateway.watsonplatform.net/discovery/api/v1/environments/{environment_id}/configurations?version=2016-12-01"
    ```

5. Using the Discovery tooling, create a new data collection. Select `voc-config` or the name of the configuration file uploaded in the previous step as your configuration file. Alternatively, you can create your collection via the command line:

    ```sh
    curl -X POST \
    -u "{username}":"{password}" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "voc_collection",
      "description": "VOC Collection",
      "configuration_id": "{configuration_id}"
    }' "https://gateway.watsonplatform.net/discovery/api/v1/environments/{environment_id}/collections?version=2016-12-01"
    ```

    If the Collection is created via command line, ensure you specify the `configuration_id` returned from step 4.

6. Use the Discovery tooling to drag and drop the Amazon reviews located in the `discovery-documents` folder. It will take a few minutes for all the documents to be ingested.

7. Note down your Discovery service username, password, environment_id, and collection_id. The `environment_id` and `collection_id` can be found under API Information on the details page of your collection within the tooling.

## <a name="running-locally"></a>Running Locally
1. Create a `.env` file in the root directory by copying the sample `.env.example` file using the following command:

  ```none
  cp .env.example .env
  ```
  You will update the `.env` with the information you retrieved in the Discovery Setup.

  The `.env` file will look something like the following:

  ```
  # environment variables
  DISCOVERY_USERNAME=<discovery-username>
  DISCOVERY_PASSWORD=<discovery-password>
  DISCOVERY_ENVIRONMENT_ID=<discovery-environment-id>
  DISCOVERY_COLLECTION_ID=<discovery-collection-id>
  ```

2. Install the dependencies you application need:

  ```bash
  npm install
  ```

3. Start the application locally:

  ```bash
  npm start
  ```

4. Point your browser to [http://localhost:3000](http://localhost:3000).


# <a name="deploying"></a>Deploying the Application to Bluemix.

You can use Cloud Foundry to deploy your local version of the app to Bluemix.

1. In the project root directory, open the `manifest.yml` file:

  * In the `applications` section of the `manifest.yml` file, change the `name` value to a unique name for your version of the demo app.
  * In the `services` section, specify the name of the Discovery service instance you created for the demo app. If you do not remember the service name, use the `cf services` command to list all services you have created.
  * Edit the `manifest.yml` file and change `<application-name>` to something unique. The name you use determines the URL of your application. For example, `<application-name>.mybluemix.net`.

  The following example shows a modified `manifest.yml` file:

    ```yaml
    declared-services:
      discovery-service:
        label: discovery
        plan: free
    applications:
    - services:
       - my-discovery-service
      name: voc-discovery
      command: npm start
      path: .
      memory: 512M
      instances: 1
      disk_quota: 1024M
    ```
2. Build the package:
    ```
    npm run build
    ```
3. Push the app to Bluemix:

    ```bash
    cf push
    ```
 After completing the steps above, you are ready to test your application. Start a browser and enter the URL of your application.

            <your application name>.mybluemix.net


For more details about developing applications that use Watson Developer Cloud services in Bluemix, see [Getting started with Watson Developer Cloud and Bluemix][getting_started].


## <a name="adaptingextending-the-starter-kit"></a>Adapting/Extending the Starter Kit

This Starter Kit works off of product reviews data gathered from Amazon product reviews (http://jmcauley.ucsd.edu/data/amazon/). Note, changes to the structure of the reviews have been made to be more for this particular example. You will need to do the following pre-processing listed below on your own:
- The reviews from this dataset does not explicitly contain the product name. The `asin` number refers to the Amazon product id which can be screenscraped from the Amazon product page. i.e. (http://www.amazon.com/dp/0000013714)
- `unixReviewTime` was converted to `review_date` in the following date format: yyyy-mm-dd
- `asin` number was renamed to `product_id`
- 'helpful' was extracted out into two fields: 'helpful' and 'not_helpful'
- Key fields were converted to snake case

The querying language depends on the name of your fields, so any deviation from the format of the reviews provided in the Starter Kit will require changes in the application.

## <a name="troubleshooting"></a>Troubleshooting

* The main source of troubleshooting and recovery information is the Bluemix log. To view the log, run the following command:

  ```sh
  cf logs <application-name> --recent
  ```


### Directory structure

```none
.
├── config                       // express and webpack configuration
│   ├── error-handler.js
│   ├── express.js
│   ├── helpers.js
│   ├── karma.conf.js
│   ├── karma-test-shim.js
│   ├── security.js
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.test.js
├── discovery-documents         // sample documents for ingestion
├── lib                         // utility modules
│   └── discovery.js
├── src                         // Angular 2 Components
│
├── manifest.yml
├── package.json
├── app.js                      // application entry point
├── tsconfig.json               // Angular 2 Typescript configuration
├── webpack.cpnfig.js           // webpack configuration
└── webpack.prod.js             // webpack configuration          
```

## <a name="ref"></a>Reference Information
### License

  This sample code is licensed under Apache 2.0.

### Contributing

  See [CONTRIBUTING](.github/CONTRIBUTING.md).

### Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

### Privacy Notice

Sample web applications that include this package may be configured to track deployments to [IBM Bluemix](https://www.bluemix.net/) and other Cloud Foundry platforms. The following information is sent to a [Deployment Tracker](https://github.com/IBM-Bluemix/cf-deployment-tracker-service) service on each deployment:

* Node.js package version
* Node.js repository URL
* Application Name (`application_name`)
* Space ID (`space_id`)
* Application Version (`application_version`)
* Application URIs (`application_uris`)
* Labels of bound services
* Number of instances for each bound service and associated plan information

This data is collected from the `package.json` file in the sample application and the `VCAP_APPLICATION` and `VCAP_SERVICES` environment variables in IBM Bluemix and other Cloud Foundry platforms. This data is used by IBM to track metrics around deployments of sample applications to IBM Bluemix to measure the usefulness of our examples, so that we can continuously improve the content we offer to you. Only deployments of sample applications that include code to ping the Deployment Tracker service will be tracked.

[cf_docs]: (https://www.ibm.com/watson/developercloud/doc/getting_started/gs-cf.shtml)
[cloud_foundry]: https://github.com/cloudfoundry/cli#downloads
[node_link]: http://nodejs.org/
[npm_link]: https://www.npmjs.com/
[service_url]: http://www.ibm.com/watson/developercloud/discovery.html
[sign_up]: bluemix.net/registration
