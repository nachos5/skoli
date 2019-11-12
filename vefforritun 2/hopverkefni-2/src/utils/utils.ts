import { IError } from '../api/types';

interface IFetch {
  data: any,
  status: number,
  isOk: Boolean,
}

// Localstorage - get jwt token
const getToken = () => {
  return localStorage.getItem('jwt');
}

/**
 * Check if error is coming from field, for css purposes, to style with
 * invalid
 * @param arr - array of errors
 * @param field - field to check
 */
const checkField = (arr: IError[], field: string) => {
  return arr.find(err => err.field === field || err.field === 'all');
}

/**
 * Asynchronous forEach loop
 * 
 * @param array 
 * @param callback 
 */
const asyncForEach = async (array: [], callback: Function) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

/**
 * Get url
 * @param request - url
 */
const http = async (request: RequestInfo) => {
  return await fetch(request, {
      method: 'GET',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    })
      .then(async (response): Promise<IFetch> => {
        return {
          data: await response.json(),
          status: response.status,
          isOk: response.ok,
        };
      })
};

/**
 * Post url
 * @param request - url
 * @param data - data to post
 */
const httpPost = async (request: RequestInfo, data: any) => {
  return await fetch(request, {
      method: 'POST',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data)
    })
      .then(async (response): Promise<IFetch> => {
        return {
          data: await response.json(),
          status: response.status,
          isOk: response.ok,
        };
      })
}

/**
 * Patch url
 * @param request - url
 * @param data - data to patch
 */
const httpPatch = async (request: RequestInfo, data: any) => {
  return await fetch(request, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data)
    })
      .then(async (response): Promise<IFetch> => {
        return {
          data: await response.json(),
          status: response.status,
          isOk: response.ok,
        };
      })
}

/**
 * Delete url
 * @param request - url
 */
const httpDelete = async (request: RequestInfo) => {
  return await fetch(request, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json; charset=utf-8',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
    })
      .then(async (response) => {
        return response;
      })
};

export {
  http,
  httpPost,
  httpPatch,
  httpDelete,
  checkField,
  asyncForEach,
}