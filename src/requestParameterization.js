import http from 'k6/http';
import { SharedArray } from 'k6/data';

import faker from '../modules/faker.js';

//  npm install browserify faker
// ./node_modules/.bin/browserify ./node_modules/faker/ -s faker > faker.js 

const BASE_URL = 'https://test-api.k6.io';

const PAYLOAD_DATA = new SharedArray('user details for registration', function () { return JSON.parse(open('../data/parameterizedData.json')).users; });
    // array-like object that shares the underlying memory between VUs

export default function () {
  const URL = `${BASE_URL}/user/register/`;
  const PARAMS = { headers: { 'Content-Type': 'application/json' } };

  //Using faker library generating random data at run time for all the iterations.This ensures realistic dynamic fake data passed
  //at run time for our payload

  const PAYLOAD = {
    username: faker.internet.userName(),
    first_name: faker.name.firstName(),
    last_name: faker.name.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  console.log("User name: " + PAYLOAD.username + " * First name: " + PAYLOAD.first_name + " * Email: " + PAYLOAD.email + " * Password: " + PAYLOAD.password)

  let response = http.post(URL, JSON.stringify(PAYLOAD), PARAMS)
  console.log('response code is :', response.status)

  // my_methods.using_shared_array();
}

// k6 run src/2_requestParameterization.js --iterations 4

const my_methods = {

  using_shared_array() {
    const URL = `${BASE_URL}/user/register/`;
    const PARAMS = { headers: { 'Content-Type': 'application/json' } };
    const PAYLOAD = JSON.stringify(PAYLOAD_DATA[__ITER])
    console.log('Iteration number :', __ITER);
    //__ITER is predefined k6 environment variable which stores the iteration index 

    let response = http.post(URL, PAYLOAD, PARAMS);
    console.log('response code is :', response.status);
  }
}
