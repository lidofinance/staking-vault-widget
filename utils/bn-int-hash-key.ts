/* eslint-disable sonarjs/prefer-single-boolean-return */
/* eslint-disable no-prototype-builtins */

/*
 * Copied from: https://github.com/jonschlinkert/is-plain-object
 *
 * The MIT License (MIT)
 * Copyright (c) 2014-present, Jon Schlinkert.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const isPlainObject = (o: any): o is Record<PropertyKey, unknown> => {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has no constructor
  const ctor = o.constructor;
  if (ctor === undefined) {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Handles Objects created by Object.create(<arbitrary prototype>)
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }

  // Most likely a plain Object
  return true;
};

const hasObjectPrototype = (o: any): boolean => {
  return Object.prototype.toString.call(o) === '[object Object]';
};

// Copy of react-query's default hash function with support for BigInt
export const bigIntHashKey = (queryKey: unknown) =>
  JSON.stringify(queryKey, (_, val) => {
    if (isPlainObject(val)) {
      return Object.keys(val)
        .sort()
        .reduce((result, key) => {
          result[key] = val[key];
          return result;
        }, {} as any);
    }
    if (typeof val === 'bigint') {
      return val.toString();
    }
    return val;
  });
