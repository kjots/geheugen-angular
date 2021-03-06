import angular from 'angular';

import { Memo } from '@kjots/geheugen';

export default angular.module('geheugen', [])
    .constant('Memo', Memo)
    .provider('memos', ['$provide', $provide => {
        const config = {};
        const registry = {};

        $provide.constant('memos.config', config);
        $provide.value('memos.registry', registry);

        let memosProvider = function memosProvider(name, ...args) {
            if (args.length === 0) {
                return ['$q', '$injector', ($q, $injector) => ensureMemo($q, $injector, name).resolve()];
            }

            let [ opts, factory ] = args.length === 1 ? [ {}, ...args ] : args;

            config[name] = { opts, factory };

            return ['$q', '$injector', ($q, $injector) => {
                let $memo = ensureMemo($q, $injector, name);

                return Object.defineProperties(() => $memo.resolve(), Object.assign({}, opts.properties, {
                    get: { value: () => $memo.get() },
                    set: { value: (value) => $memo.set(value) },
                    reset: { value: () => $memo.reset() },
                    resetDependants: { value: () => $memo.resetDependants() }
                }));
            }];
        };

        memosProvider.$get = ['$q', '$injector', ($q, $injector) => {
            return Object.defineProperties(name => ensureMemo($q, $injector, name).resolve(), {
                get: { value: name => ensureMemo($q, $injector, name).get() },
                set: { value: (name, value) => ensureMemo($q, $injector, name).set(value) },
                reset: { value: name => ensureMemo($q, $injector, name).reset() },
                resetDependants: { value: name => ensureMemo($q, $injector, name).resetDependants() }
            });
        }];

        return memosProvider;

        function ensureMemo($q, $injector, name, context = []) {
            if (registry[name] === undefined) {
                registry[name] = createMemo($q, $injector, name, context);
            }

            return registry[name];
        }

        function createMemo($q, $injector, name, context) {
            let nextContext = [ name, ...context ];

            if (config[name] === undefined) {
                throw new Error(`[geheugen] Unknown memo: ${ nextContext.join(' <- ') }`);
            }

            if (context.includes(name)) {
                throw new Error(`[geheugen] Circular dependency detected: ${ nextContext.join(' <- ') }`);
            }

            let { opts, factory } = config[name];
            let dependencies = opts.dependencies || [];

            return new Memo({
                Q: $q,
                singleton: opts.singleton !== undefined ? opts.singleton : true,
                dependencies: dependencies.map(dependency => ensureMemo($q, $injector, dependency, nextContext)),
                onSet: opts.onSet !== undefined ? value => $injector.invoke(opts.onSet, undefined, { value }) : undefined,
                onReset: opts.onReset !== undefined ? () => $injector.invoke(opts.onReset) : undefined,
                factory: values => $injector.invoke(factory, undefined, dependencies.reduce((locals, dependency, i) => {
                    locals[dependency] = values[i];

                    return locals;
                }, {}))
            });
        }
    }]);