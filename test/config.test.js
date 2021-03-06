/*
Copyright 2017 Bitnami.

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

'use strict';

const _ = require('lodash');
const expect = require('chai').expect;
const Config = require('../lib/config');
const helpers = require('../lib/helpers');
const sinon = require('sinon');
const loadKubeConfig = require('./lib/load-kube-config');

describe('Config', () => {
  describe('#constructor', () => {
    const previousEnv = _.cloneDeep(process.env);
    beforeEach(() => {
      sinon.stub(helpers, 'loadKubeConfig').callsFake(loadKubeConfig);
    });
    afterEach(() => {
      helpers.loadKubeConfig.restore();
      process.env = _.cloneDeep(previousEnv);
    });
    it('should set the given namespace', () => {
      const config = new Config({ namespace: 'figjam' });
      expect(config.namespace).to.be.eql('figjam');
      expect(config.connectionOptions.url).to.be.eql(
        'http://1.2.3.4:4433/api/v1/namespaces/figjam/configmaps/kubeless-config'
      );
    });
    it('should set the given namespace even if env var is set', () => {
      process.env.KUBELESS_NAMESPACE = 'foobar';
      const config = new Config({ namespace: 'figjam' });
      expect(config.namespace).to.be.eql('figjam');
      expect(config.connectionOptions.url).to.be.eql(
        'http://1.2.3.4:4433/api/v1/namespaces/figjam/configmaps/kubeless-config'
      );
    });
    it('should set the namespace given via an env var if none is given in options', () => {
      process.env.KUBELESS_NAMESPACE = 'foobar';
      const config = new Config();
      expect(config.namespace).to.be.eql('foobar');
      expect(config.connectionOptions.url).to.be.eql(
        'http://1.2.3.4:4433/api/v1/namespaces/foobar/configmaps/kubeless-config'
      );
    });
  });
});
