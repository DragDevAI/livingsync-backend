import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 70 }, 
    { duration: '1m', target: 70 },
    { duration: '30s', target: 0 },
  ],
  
  thresholds: {
    'http_req_duration': ['p(95)<500'],
    'http_req_failed': ['rate<0.01'],
  },
};

export default function () {
  // Define the target API
  const url = 'http://localhost:3000/account/login';
  
  const payload = JSON.stringify({
    name: 'BDDTestOwner',
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'is status 200': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  sleep(1); 
};