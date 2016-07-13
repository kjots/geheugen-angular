export const registry = {};

export function provider(name, ...args) {
    if (args.length === 0) {
        return () => registry[name].resolve();
    }

    let [ opts, factory ] = args.length === 1 ? [ {}, ...args ] : args;

    registry[name] = { opts, factory };

    return () => {
        let memo = () => registry[name].resolve();

        memo.reset = () => registry[name].reset();
        memo.resetDependants = () => registry[name].resetDependants();

        return memo;
    };
}

provider.$get = () => {
    let memos = name => registry[name].resolve();

    memos.reset = name => registry[name].reset();
    memos.resetDependants = name => registry[name].resetDependants();

    return memos;
};