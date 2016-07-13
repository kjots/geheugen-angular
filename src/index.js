import angular from 'angular';

import { Memo } from 'geheugen';

import * as memos from './memos.js';

export default angular.module('geheugen', [])
    .constant('Memo', Memo)
    .constant('memos.registry', memos.registry)
    .provider('memos', () => memos.provider)
    .run(['$q', '$injector', ($q, $injector) => {
        Object.keys(memos.registry).forEach(ensureMemo);

        function ensureMemo(name) {
            if (!(memos.registry[name] instanceof Memo)) {
                let memo = memos.registry[name];
                let dependencies = memo.opts.dependencies || [];

                memos.registry[name] = new Memo({
                    Q: $q,
                    singleton: memo.opts.singleton !== undefined ? memo.opts.singleton : true,
                    dependencies: dependencies.map(ensureMemo),
                    onReset: memo.opts.onReset !== undefined ? () => $injector.invoke(memo.opts.onReset) : undefined,
                    factory: values => $injector.instantiate(memo.factory, dependencies.reduce((locals, dependency, i) => {
                        locals[dependency] = values[i];

                        return locals;
                    }, {}))
                });
            }

            return memos.registry[name];
        }
    }]);