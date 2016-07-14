# geheugen-angular

[![Build Status](https://travis-ci.org/kjots/geheugen-angular.svg?branch=master)](https://travis-ci.org/kjots/geheugen-angular)
[![npm version](https://badge.fury.io/js/geheugen-angular.svg)](https://www.npmjs.com/package/geheugen-angular)

> Angular bindings for [geheugen](https://github.com/kjots/geheugen).

## Installation

```shell
npm install --save geheugen-angular
```

## Usage

```html
<script src="babel-polyfill/dist/polyfill.js"></script>
<script src="angular/angular.js"></script>

<script src="geheugen-angular/dist/geheugen-angular.js"></script>

<script>
    angular.module('exampleApp', [ 'geheugen' ]);
</script>
```

## API

### Constants

#### Memo
Type: `Class`

The geheugen [Memo](https://github.com/kjots/geheugen#memo) class.

#### memos.registry
Type: `Object<String,Memo>`

The registry of geheugen [Memo](https://github.com/kjots/geheugen#memo) instances, keyed by their name.

### Services

#### memosProvider(name)
Type: `Function`

Returns an Angular constructor<sup>[1](#note1)</sup> for the resolved value of the memo with the provided name.

The return value of this function is suitable for being used as a dependency of an Angular route, e.g.:

```js
angular.module('exampleApp')
    .config(($routeProvider, memosProvider) => {
        $routeProvider.when('/exampleRoute', {
            resolve: {
                example: memosProvider('example')
            }
        });
    });
```

##### name
Type: `String`

The name of the memo.

<a name="memos-provider"></a>
#### memosProvider(name, [opts], factory)
Type: `Function`

Register a memo with the provided name.

Returns an Angular constructor<sup>[1](#note1)</sup> for the [memo](#memo-instance).

The return value of this function is suitable for being used as the `$get` method of an Angular provider, e.g.:

```js
angular.module('exampleApp')
    .provider('exampleMemo', function (memosProvider) {
        this.$get = memosProvider('example',
            $filter => $filter('number')('3.1415', 2));
    });
```

##### name
Type: `String`

The name of the memo.

##### opts
Type: `Object<String, ?>`

Default: `{}`

The memo options.

###### singleton
Type: `Boolean`

Default: `true`

The singleton flag.

###### dependencies
Type: `Array<String>`

Default: `[]`

The dependencies of the memo.

This array contains the names of the memos upon which this memo depends.

The resolved values of the dependant memos will be available as locals to the Angular constructor<sup>[1](#note1)</sup>
provided via `factory`, e.g.:

```js
angular.module('exampleApp')
    .provider('dependencyMemo', function (memosProvider) {
        this.$get = memosProvider('dependency', () => '3.1415');
    })
    .provider('exampleMemo', function (memosProvider) {
        this.$get = memosProvider('example', { dependencies: [ 'dependency' ] },
            ($filter, dependency) => $filter('number')(dependency, 2));
    });
```

###### onReset
Type: `Function`

The reset event handler.

This function will be invoked when the memo is reset.

This function will be invoked via [`$injector.invoke()`](https://docs.angularjs.org/api/auto/service/$injector#invoke).

##### factory
Type: `Function` or `Array`

The Angular constructor<sup>[1](#note1)</sup> for the resolved value of the memo.

The factory can return the either resolved value itself or a promise for the resolved value.

#### memos(name)
Type: `Function`

Returns the resolved value of the memo with the provided name.

##### name
Type: `String`

The name of the memo.

##### memos.reset(name)
Type: `Function`

Reset the memo with the provided name.

###### name
Type: `String`

The name of the memo.

##### memos.resetDependants(name)
Type: `Function`

Reset the dependants of the memo with the provided name.

###### name
Type: `String`

The name of the memo.

### Instances

<a name="memo-instance"></a>
#### memo()
Type: `Function`

Returns the resolved value of the memo.

A memo instance can be created via [memosProvider()](#memos-provider).

##### memo.reset()
Type: `Function`

Reset the memo.

##### memo.resetDependants()
Type: `Function`

Reset the dependants of the memo.

## Notes

<small>
    <a name="note1">1</a>: An Angular constructor is any value that can be passed as the `Type` argument to
    [`$injector.instantiate()`](https://docs.angularjs.org/api/auto/service/$injector#instantiate).
</small>