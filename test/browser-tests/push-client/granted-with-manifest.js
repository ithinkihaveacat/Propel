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

'use strict';

describe('Test Successful Permission State', () => {
  it('should request permission for push and get a granted response', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.requestPermission()
    .then(state => {
      state.should.equal('granted');
    });
  });

  if (Notification.permission !== 'granted') {
    return;
  }

  it('getSubscription() should return null when the user isn\'t subscribed yet', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.getSubscription()
    .then(subscription => {
      window.chai.expect(subscription).to.equal(null);
    });
  });

  it('subscribe() should throw an error due to no manifest', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.subscribe()
    .then(subscription => {
      (subscription instanceof PushSubscription).should.equal(true);
    });
  });

  it('getSubscription() should return a subscription after calling subscribe()', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.subscribe()
    .then(subscription => {
      (subscription instanceof PushSubscription).should.equal(true);

      return pushClient.getSubscription();
    })
    .then(subscription => {
      (subscription instanceof PushSubscription).should.equal(true);
    });
  });

  it('unsubscribe() should not throw an error', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.unsubscribe()
    .then(() => {
      // Make sure any subscription was unsubscribed
      return pushClient.getSubscription()
      .then(subscription => {
        window.chai.expect(subscription).to.equal(null);
      });
    });
  });

  it('getRegistration() should return null since no sw is registered', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.getRegistration()
    .then(registration => {
      window.chai.expect(registration).to.equal(null);
    });
  });

  it('getRegistration() should return a registration after calling subscribe', function() {
    const pushClient = new window.goog.propel.Client();
    return pushClient.subscribe()
    .then(() => {
      // Make sure any subscription was unsubscribed
      return pushClient.getRegistration()
      .then(registration => {
        (registration instanceof ServiceWorkerRegistration).should.equal(true);
      });
    });
  });

  it('statuschange event should fire when first create the push client', function(done) {
    const pushClient = new window.goog.propel.Client();
    pushClient.addEventListener('statuschange', event => {
      event.type.should.equal('statuschange');
      event.isSubscribed.should.equal(false);
      event.permissionStatus.should.equal('granted');
      window.chai.expect(event.currentSubscription).to.equal(null);

      done();
    });
  });

  it('statuschange event should fire after the subscription succeeds', function(done) {
    const pushClient = new window.goog.propel.Client();

    let statusChangeCounter = 0;

    pushClient.addEventListener('statuschange', event => {
      statusChangeCounter++;
      event.type.should.equal('statuschange');
      if (statusChangeCounter === 2) {
        event.isSubscribed.should.equal(true);
        event.permissionStatus.should.equal('granted');
        (event.currentSubscription instanceof PushSubscription).should.equal(true);
      } else {
        event.isSubscribed.should.equal(false);
        event.permissionStatus.should.equal('granted');
        window.chai.expect(event.currentSubscription).to.equal(null);
      }

      if (statusChangeCounter === 2) {
        done();
      }
    });

    pushClient.subscribe();
  });

  it('statuschange event should fire after calling unsubscription', function(done) {
    const pushClient = new window.goog.propel.Client();

    let statusChangeCounter = 0;

    pushClient.addEventListener('statuschange', event => {
      statusChangeCounter++;
      event.type.should.equal('statuschange');
      event.isSubscribed.should.equal(false);
      event.permissionStatus.should.equal('granted');
      window.chai.expect(event.currentSubscription).to.equal(null);

      if (statusChangeCounter === 2) {
        done();
      }
    });

    pushClient.unsubscribe();
  });

  it('statuschange event should fire for both calls subscribe() and unsubscribe()', function(done) {
    const pushClient = new window.goog.propel.Client();

    let statusChangeCounter = 0;

    pushClient.addEventListener('statuschange', event => {
      statusChangeCounter++;
      event.type.should.equal('statuschange');

      if (statusChangeCounter === 3) {
        done();
      }
    });

    pushClient.subscribe()
    .then(() => {
      return pushClient.unsubscribe();
    });
  });
});
