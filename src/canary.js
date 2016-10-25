// src/canary.js

export const canary = (echoParameter) => `The canary says: ${echoParameter}`;

export const asyncCanary = (echoParameter) => new Promise((resolve, reject) => {
  try {
    setTimeout(() => {
      resolve(`The canary says: ${echoParameter}`);
    }, 1000);
  } catch (e) {
    reject(`The canary died. Error: ${e}`);
  }
});
