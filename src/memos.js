import { Memo } from 'geheugen';

export const config = {};
export const registry = {};

export function provider(name, ...args) {
    if (args.length === 0) {
        return ['$q', '$injector', ($q, $injector) => ensureMemo($q, $injector, name).resolve()];
    }

    let [ opts, factory ] = args.length === 1 ? [ {}, ...args ] : args;

    config[name] = { opts, factory };

    return ['$q', '$injector', ($q, $injector) => {
        let $memo = ensureMemo($q, $injector, name);

        let memo = () => $memo.resolve();

        memo.reset = () => $memo.reset();
        memo.resetDependants = () => $memo.resetDependants();

        return memo;
    }];
}

provider.$get = ['$q', '$injector', ($q, $injector) => {
    let memos = name => ensureMemo($q, $injector, name).resolve();

    memos.reset = name => ensureMemo($q, $injector, name).reset();
    memos.resetDependants = name => ensureMemo($q, $injector, name).resetDependants();

    return memos;
}];

function ensureMemo($q, $injector, name) {
    if (registry[name] === undefined) {
        registry[name] = createMemo($q, $injector, name);
    }

    return registry[name];
}

function createMemo($q, $injector, name) {
    let { opts, factory } = config[name];
    let dependencies = opts.dependencies || [];

    return new Memo({
        Q: $q,
        singleton: opts.singleton !== undefined ? opts.singleton : true,
        dependencies: dependencies.map(dependency => ensureMemo($q, $injector, dependency)),
        onReset: opts.onReset !== undefined ? () => $injector.invoke(opts.onReset) : undefined,
        factory: values => $injector.invoke(factory, undefined, dependencies.reduce((locals, dependency, i) => {
            locals[dependency] = values[i];

            return locals;
        }, {}))
    });
}