import angular from 'angular';

import { Memo } from 'geheugen';

import * as memos from './memos.js';

export default angular.module('geheugen', [])
    .constant('Memo', Memo)
    .constant('memos.config', memos.config)
    .value('memos.registry', memos.registry)
    .provider('memos', () => memos.provider)
    .run(['$q', '$injector', ($q, $injector) => {
        Object.keys(memos.config).forEach(ensureMemo);

        function ensureMemo(name) {
            if (memos.registry[name] === undefined) {
                let { opts, factory } = memos.config[name];
                let dependencies = opts.dependencies || [];

                memos.registry[name] = new Memo({
                    Q: $q,
                    singleton: opts.singleton !== undefined ? opts.singleton : true,
                    dependencies: dependencies.map(ensureMemo),
                    onReset: opts.onReset !== undefined ? () => $injector.invoke(opts.onReset) : undefined,
                    factory: values => $injector.invoke(factory, undefined, dependencies.reduce((locals, dependency, i) => {
                        locals[dependency] = values[i];

                        return locals;
                    }, {}))
                });
            }

            return memos.registry[name];
        }
    }]);