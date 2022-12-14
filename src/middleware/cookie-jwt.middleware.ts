import {Next} from '@loopback/core';
import {MiddlewareContext} from '@loopback/rest';
import {sign} from 'jsonwebtoken';

// we can get secert from env
const jwtSecret = 'example-secert';

function createJWT(data: object): string {
  const token = sign(data, jwtSecret, {expiresIn: '1h'});
  return token;
}
const parseCookie = (cookieString: string) => {
  return cookieString
    .split(';')
    .map((v: string) => v.split('='))
    .reduce((acc: {[key: string]: string}, v) => {
      if (v[1]) {
        acc[v[0].trim()] = v[1].trim();
      }
      return acc;
    }, {});
};
const middleware = async (ctx: MiddlewareContext, next: Next) => {
  const {request} = ctx;
  // get userId from cookie
  // we can use cookie-parse
  // for now we get user manually from cookie

  const cookies = parseCookie(request.headers['cookie'] ?? '');
  const userId = cookies.userId;
  if (userId) {
    // now create a jwt and add it to headers
    const jwtToken = createJWT({userId: userId});
    // now add to headers
    request.headers['authoriation'] = 'Bearer ' + jwtToken;
  }
  const result = await next();
  return result;
};
export default middleware;
