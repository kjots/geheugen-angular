import angular from 'angular';

import { Memo } from 'geheugen';

export default angular.module('geheugen', [])
    .constant('Memo', Memo);