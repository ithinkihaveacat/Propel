/*
  Copyright 2016 Google Inc. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

// This is a test and we want descriptions to be useful, if this
// breaks the max-length, it's ok.

/* eslint-disable max-len, no-unused-expressions */
/* eslint-env browser, mocha */
/* global testHelper */

'use strict';

describe('Test PushClient', () => {
  it('should be able to find window.goog.propel.Client', function() {
    window.goog.propel.Client.should.be.defined;
  });

  describe('Test PushClient construction', () => {
    it('should be able to create a new push client', function() {
      var pushClient = new window.goog.propel.Client();
      window.chai.expect(pushClient._scope).to.contain('goog.push.scope/');
      window.chai.expect(pushClient._workerUrl).to.contain('dist/worker.js');
    });

    it('should be able to create a new push client with an empty object', function() {
      var pushClient = new window.goog.propel.Client({});
      window.chai.expect(pushClient._scope).to.contain('goog.push.scope/');
      window.chai.expect(pushClient._workerUrl).to.contain('dist/worker.js');
    });

    it('should be able to create a new push client with additional options', function() {
      var pushClient = new window.goog.propel.Client({
        workerUrl: '/sw.js'
      });
      window.chai.expect(pushClient._scope).to.contain('goog.push.scope/');
      window.chai.expect(pushClient._workerUrl).to.equal('/sw.js');
    });

    it('should be able to create a new push client with just workerUrl option', function() {
      var pushClient = new window.goog.propel.Client({
        scope: './custom.scope.push'
      });
      window.chai.expect(pushClient._scope).to.contain('./custom.scope.push');
      window.chai.expect(pushClient._workerUrl).to.contain('dist/worker.js');
    });

    it('should be able to create a new push client with just workerUrl option', function() {
      var pushClient = new window.goog.propel.Client({
        scope: './custom.scope.push',
        workerUrl: '/sw.js'
      });
      window.chai.expect(pushClient._scope).to.contain('./custom.scope.push');
      window.chai.expect(pushClient._workerUrl).to.contain('/sw.js');
    });
  });

  describe('Test Scenarios with Granted Permission State', () => {
    it('should start and test granted tests with no manifest', function(done) {
      this.timeout(0);

      const windowHandler = window.open('/test/granted-no-manifest.html');
      window.onTestResults = results => {
        windowHandler.close();

        if (results.failed.length > 0) {
          console.error(results.failed);
          done(new Error('Tests failed', results.failed));
        } else {
          done();
        }
      };
    });

    it('should start and test granted tests with a manifest', function(done) {
      this.timeout(0);

      const windowHandler = window.open('/test/granted-with-manifest.html');
      window.onTestResults = results => {
        windowHandler.close();

        if (results.failed.length > 0) {
          console.error(results.failed);
          done(new Error('Tests failed', results.failed));
        } else {
          done();
        }
      };
    });
  });
});
