'use strict';

describe('geheugen', () => {
    describe('memos()', () => {
        beforeEach(module('geheugen'));

        context('when the factory returns a promise', () => {
            it('should throw an error if there is no memo with the provided name', inject(memos => {
                // Given
                
                // When
                let fn = () => memos('testValue');

                // Then
                expect(fn).to.throw(Error, '[geheugen] Unknown memo: testValue');
            }));

            it('should return the promise for the memo with the provided name', done => {
                module(memosProvider => {
                    // Given
                    memosProvider('testValue', $q => $q.resolve('Test Value'));
                });

                inject(($rootScope, memos) => {
                    // When
                    let testValuePromise = memos('testValue');

                    // Then
                    expect(testValuePromise).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });
        });

        context('when the factory does not return a promise', () => {
            it('should return the promise for the memo with the provided name', done => {
                module(memosProvider => {
                    // Given
                    memosProvider('testValue', () => 'Test Value');
                });

                inject(($rootScope, memos) => {
                    // When
                    let testValuePromise = memos('testValue');

                    // Then
                    expect(testValuePromise).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });
        });

        describe('reset()', () => {
            it('should reset the memo with the provided name', done => {
                let testValue, testValueMemoGetFn;

                module(memosProvider => {
                    testValue = 'Test Value';

                    testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve(testValue));
                });

                inject(($injector, $rootScope, memos) => {
                    // Given
                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    testValueMemo();

                    $rootScope.$digest();

                    // When
                    testValue = 'New Test Value';

                    memos.reset('testValue');

                    // Then
                    expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });
        });

        describe('resetDependants()', () => {
            it('should reset the dependants of the memo with the provided name', done => {
                let testValue, testDependencyMemoGetFn, testValueMemoGetFn;

                module(memosProvider => {
                    testValue = 'Test Value';

                    testDependencyMemoGetFn = memosProvider('testDependency', $q => $q.resolve('Test Dependency'));
                    testValueMemoGetFn = memosProvider('testValue', { dependencies: [ 'testDependency' ] }, $q => $q.resolve(testValue));
                });

                inject(($injector, $rootScope, memos) => {
                    // Given
                    $injector.instantiate(testDependencyMemoGetFn);

                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    testValueMemo();

                    $rootScope.$digest();

                    // When
                    testValue = 'New Test Value';

                    memos.resetDependants('testDependency');

                    // Then
                    expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });
        });
    });
});