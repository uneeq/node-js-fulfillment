// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

const functions = require('firebase-functions');
const { WebhookClient, Card, Image } = require('dialogflow-fulfillment');
const axios = require('axios');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });

  // async function customSearch(q) {
  //   const params = {
  //     q: q,
  //     searchType: 'image',
  //     fileType: 'jpg',
  //     imgSize: 'xlarge',
  //     alt: 'json'
  //   };
  //
  //   try {
  //     const res = await axios.get('https://www.googleapis.com/customsearch/v1?'+
  //       'key=AIzaSyBHqKf-ITf1G6ou0SNYT4J8AvwT-l3dbmo&'+
  //       'cx=014441302245664909274:eierbt8jsvk',
  //       { params }
  //     )
  //     const item = res.data.items[0];
  //
  //     return `Your car: ${item.link}`;
  //   } catch(error) {
  //     return 'Oh no, it went wrong! ' + JSON.stringify(error);
  //   }
  // }

  function detectCar(agent) {
    let data = request.body.queryResult.outputContexts
      .filter((field)=>{
        return field.lifespanCount == 99
      })[0].parameters;

    const params = {
      q: `${data['car-model']} ${data['color']}`,
      searchType: 'image',
      fileType: 'jpg',
      imgSize: 'xlarge',
      alt: 'json'
    };

    return axios.get('https://www.googleapis.com/customsearch/v1?'+
      'key=AIzaSyBHqKf-ITf1G6ou0SNYT4J8AvwT-l3dbmo&'+
      'cx=014441302245664909274:eierbt8jsvk',
      { params }
    )
    .then(response => {
      const item = response.data.items[0];
      console.log(item);

      agent.add(`Your car, ${data['full-name']}: ${item.link}`);
    })
    .catch(error => {
      agent.add('Oh no, it went wrong! ' + JSON.stringify(error));
      console.log(error);
    });
  }

  let intentMap = new Map();
  intentMap.set('detect-car-color', detectCar);

  agent.handleRequest(intentMap);
});
