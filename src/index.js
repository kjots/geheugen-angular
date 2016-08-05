import angular from 'angular';

import { Memo } from 'geheugen';

import * as memos from './memos.js';

export default angular.module('geheugen', [])
    .constant('Memo', Memo)
    .constant('memos.config', memos.config)
    .value('memos.registry', memos.registry)
    .provider('memos', () => memos.provider);