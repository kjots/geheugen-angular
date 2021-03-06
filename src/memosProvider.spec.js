'use strict';

describe('geheugen', () => {
    describe('memosProvider()', () => {
        beforeEach(module('geheugen'));

        context('when invoked with 1 argument', () => {
            it('should return an Angular constructor for the promise for the memo with the provided name', done => {
                let testValuePromiseGetFn;

                module(memosProvider => {
                    // Given
                    memosProvider('testValue', $q => $q.resolve('Test Value'));

                    // When
                    testValuePromiseGetFn = memosProvider('testValue');
                });

                inject(($injector, $rootScope) => {
                    // Then
                    let testValuePromise = $injector.instantiate(testValuePromiseGetFn);

                    expect(testValuePromise).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });
        });

        context('when invoked with 2 arguments', () => {
            it('should return an Angular constructor for the memo', done => {
                let testValueMemoGetFn;

                module(memosProvider => {
                    // Given

                    // When
                    testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve('Test Value'));
                });

                inject(($injector, $rootScope) => {
                    // Then
                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    expect(testValueMemo()).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });

            it('should provide a singleton memo', done => {
                let testValue, testValueMemoGetFn;

                module(memosProvider => {
                    testValue = 'Test Value';

                    testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve(testValue));
                });

                inject(($injector, $rootScope) => {
                    // Given
                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    testValueMemo();

                    $rootScope.$digest();

                    // When
                    testValue = 'New Test Value';

                    // Then
                    expect(testValueMemo()).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });

            it('should provide a memo that returns the same promise instance whilst the promise is pending', () => {
                let testValueMemoGetFn;

                module(memosProvider => {
                    testValueMemoGetFn = memosProvider('testValue', $q => $q.defer().promise);
                });

                inject($injector => {
                    // Given
                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    // When
                    let testValuePromise1 = testValueMemo();
                    let testValuePromise2 = testValueMemo();

                    // Then
                    expect(testValuePromise1).to.equal(testValuePromise2);
                });
            });

            describe('get()', () => {
                it('should return the value of the memo', done => {
                    let testValueMemoGetFn;

                    module(memosProvider => {
                        testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve('Test Value'));
                    });

                    inject(($injector, $rootScope) => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        testValueMemo();

                        $rootScope.$digest();

                        // When
                        let value = testValueMemo.get();

                        // Then
                        expect(value).to.equal('Test Value');

                        done();
                    });
                });
            });

            describe('set()', () => {
                it('should update the value of the memo', done => {
                    let testValueMemoGetFn;

                    module(memosProvider => {
                        testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve('Test Value'));
                    });

                    inject(($injector, $rootScope) => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        testValueMemo();

                        $rootScope.$digest();

                        // When
                        testValueMemo.set('New Test Value');

                        // Then
                        expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                        $rootScope.$digest();
                    });
                });
            });

            describe('reset()', () => {
                it('should reset the memo', done => {
                    let testValue, testValueMemoGetFn;

                    module(memosProvider => {
                        testValue = 'Test Value';

                        testValueMemoGetFn = memosProvider('testValue', $q => $q.resolve(testValue));
                    });

                    inject(($injector, $rootScope) => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        testValueMemo();

                        $rootScope.$digest();

                        // When
                        testValue = 'New Test Value';

                        testValueMemo.reset();

                        // Then
                        expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                        $rootScope.$digest();
                    });
                });
            });
        });

        context('when invoked with 3 arguments', () => {
            it('should return an Angular constructor for the memo', done => {
                let testValueMemoGetFn;

                module(memosProvider => {
                    // Given

                    // When
                    testValueMemoGetFn = memosProvider('testValue', {}, $q => $q.resolve('Test Value'));
                });

                inject(($injector, $rootScope) => {
                    // Then
                    let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                    expect(testValueMemo()).to.eventually.equal('Test Value').and.notify(done);

                    $rootScope.$digest();
                });
            });

            context('when the properties option is set', () => {
                it('should provide a memo with the properties defined', done => {
                    let testValueMemoGetFn;

                    module(memosProvider => {
                        // Given
                        let properties = { testProperty: { value: 'Test Property Value' } };

                        testValueMemoGetFn = memosProvider('testValue', { properties }, $q => $q.resolve('Test Value'));
                    });

                    inject($injector => {
                        // When
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        // Then
                        expect(testValueMemo.testProperty).to.equal('Test Property Value');

                        done();
                    });
                });
            });

            context('when the singleton option is set', () => {
                it('should provide a singleton memo', done => {
                    let testValue, testValueMemoGetFn;

                    module(memosProvider => {
                        testValue = 'Test Value';

                        testValueMemoGetFn = memosProvider('testValue', { singleton: true }, $q => $q.resolve(testValue));
                    });

                    inject(($injector, $rootScope) => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        testValueMemo();

                        $rootScope.$digest();

                        // When
                        testValue = 'New Test Value';

                        // Then
                        expect(testValueMemo()).to.eventually.equal('Test Value').and.notify(done);

                        $rootScope.$digest();
                    });
                });

                it('should provide a memo that returns the same promise instance whilst the promise is pending', () => {
                    let testValueMemoGetFn;

                    module(memosProvider => {
                        testValueMemoGetFn = memosProvider('testValue', { singleton: true }, $q => $q.defer().promise);
                    });

                    inject($injector => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        // When
                        let testValuePromise1 = testValueMemo();
                        let testValuePromise2 = testValueMemo();

                        // Then
                        expect(testValuePromise1).to.equal(testValuePromise2);
                    });
                });

                describe('get()', () => {
                    it('should return the value of the memo', done => {
                        let testValueMemoGetFn;

                        module(memosProvider => {
                            testValueMemoGetFn = memosProvider('testValue', { singleton: true }, $q => $q.resolve('Test Value'));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            let value = testValueMemo.get();

                            // Then
                            expect(value).to.equal('Test Value');

                            done();
                        });
                    });
                });

                describe('set()', () => {
                    it('should update the value of the memo', done => {
                        let testValueMemoGetFn;

                        module(memosProvider => {
                            testValueMemoGetFn = memosProvider('testValue', { singleton: true }, $q => $q.resolve('Test Value'));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            testValueMemo.set('New Test Value');

                            // Then
                            expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                            $rootScope.$digest();
                        });
                    });
                });

                describe('reset()', () => {
                    it('should reset the memo', done => {
                        let testValue, testValueMemoGetFn;

                        module(memosProvider => {
                            testValue = 'Test Value';

                            testValueMemoGetFn = memosProvider('testValue', { singleton: true }, $q => $q.resolve(testValue));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            testValue = 'New Test Value';

                            testValueMemo.reset();

                            // Then
                            expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                            $rootScope.$digest();
                        });
                    });
                });
            });

            context('when the singleton option is cleared', () => {
                it('should provide a non-singleton memo', done => {
                    let testValue, testValueMemoGetFn;

                    module(memosProvider => {
                        testValue = 'Test Value';

                        testValueMemoGetFn = memosProvider('testValue', { singleton: false }, $q => $q.resolve(testValue));
                    });

                    inject(($injector, $rootScope) => {
                        // Given
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        testValueMemo();

                        $rootScope.$digest();

                        // When
                        testValue = 'New Test Value';

                        // Then
                        expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                        $rootScope.$digest();
                    });
                });

                describe('get()', () => {
                    it('should return the value of the memo', done => {
                        let testValueMemoGetFn;

                        module(memosProvider => {
                            testValueMemoGetFn = memosProvider('testValue', { singleton: false }, $q => $q.resolve('Test Value'));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            let value = testValueMemo.get();

                            // Then
                            expect(value).to.equal('Test Value');

                            done();
                        });
                    });
                });
            });

            context('when the onSet function option is provided', () => {
                describe('set()', () => {
                    it('should invoke the onSet function', () => {
                        let testOnSet, testValueMemoGetFn;

                        module(memosProvider => {
                            testOnSet = sinon.spy();
                            testValueMemoGetFn = memosProvider('testValue', { onSet: [ 'value', testOnSet ] }, $q => $q.resolve('Test Value'));
                        });

                        inject($injector => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            // When
                            testValueMemo.set('New Test Value');

                            // Then
                            expect(testOnSet).to.have.been.calledWith('New Test Value');
                        });
                    });
                });
            });

            context('when the onReset function option is provided', () => {
                describe('reset()', () => {
                    it('should invoke the onReset function', () => {
                        let testOnReset, testValueMemoGetFn;

                        module(memosProvider => {
                            testOnReset = sinon.spy();
                            testValueMemoGetFn = memosProvider('testValue', { onReset: testOnReset }, $q => $q.resolve('Test Value'));
                        });

                        inject($injector => {
                            // Given
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            // When
                            testValueMemo.reset();

                            // Then
                            expect(testOnReset).to.have.been.called;
                        });
                    });
                });
            });

            context('when the dependencies option is provided', () => {
                it('should throw an error if the dependencies contains a dependency that does not exist', () => {
                    module(memosProvider => {
                        // Given
                        memosProvider('testDependencyA', { dependencies: [ 'testDependencyB' ] }, $q => $q.resolve('Test Dependency A'));
                        memosProvider('testDependencyB', { dependencies: [ 'testDependencyC' ] }, $q => $q.resolve('Test Dependency B'));
                        memosProvider('testDependencyC', { dependencies: [ 'testDependencyD' ] }, $q => $q.resolve('Test Dependency C'));

                        memosProvider('testValue', { dependencies: [ 'testDependencyA' ] }, $q => $q.resolve('Test Value'));
                    });

                    inject(memos => {
                        // When
                        let fn = () => memos('testValue');

                        // Then
                        expect(fn).to.throw(Error, '[geheugen] Unknown memo: testDependencyD <- testDependencyC <- testDependencyB <- testDependencyA <- testValue');
                    });
                });

                it('should throw an error if the dependencies contains a circular reference', () => {
                    module(memosProvider => {
                        // Given
                        memosProvider('testDependencyA', { dependencies: [ 'testDependencyB' ] }, $q => $q.resolve('Test Dependency A'));
                        memosProvider('testDependencyB', { dependencies: [ 'testDependencyC' ] }, $q => $q.resolve('Test Dependency B'));
                        memosProvider('testDependencyC', { dependencies: [ 'testDependencyA' ] }, $q => $q.resolve('Test Dependency C'));

                        memosProvider('testValue', { dependencies: [ 'testDependencyA' ] }, $q => $q.resolve('Test Value'));
                    });

                    inject(memos => {
                        // When
                        let fn = () => memos('testValue');

                        // Then
                        expect(fn).to.throw(Error, '[geheugen] Circular dependency detected: testDependencyA <- testDependencyC <- testDependencyB <- testDependencyA <- testValue');
                    });
                });

                it('should provide a memo that makes available the resolved values of the dependencies', done => {
                    let testValueMemoGetFn;

                    module(memosProvider => {
                        // Given
                        memosProvider('testDependency', $q => $q.resolve('Test Dependency'));

                        testValueMemoGetFn = memosProvider('testValue', { dependencies: [ 'testDependency' ] }, ($q, testDependency) => $q.resolve(testDependency));
                    });

                    inject(($injector, $rootScope) => {
                        // When
                        let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                        // Then
                        expect(testValueMemo()).to.eventually.equal('Test Dependency').and.notify(done);

                        $rootScope.$digest();
                    });
                });

                describe('set()', () => {
                    it('should reset the dependants of the memo', done => {
                        let testValue, testDependencyMemoGetFn, testValueMemoGetFn;

                        module(memosProvider => {
                            testValue = 'Test Value';

                            testDependencyMemoGetFn = memosProvider('testDependency', $q => $q.resolve('Test Dependency'));
                            testValueMemoGetFn = memosProvider('testValue', { dependencies: [ 'testDependency' ] }, $q => $q.resolve(testValue));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testDependencyMemo = $injector.instantiate(testDependencyMemoGetFn);
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            testValue = 'New Test Value';

                            testDependencyMemo.set('New Test Dependency');

                            // Then
                            expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                            $rootScope.$digest();
                        });
                    });
                });

                describe('reset()', () => {
                    it('should reset the dependants of the memo', done => {
                        let testValue, testDependencyMemoGetFn, testValueMemoGetFn;

                        module(memosProvider => {
                            testValue = 'Test Value';

                            testDependencyMemoGetFn = memosProvider('testDependency', $q => $q.resolve('Test Dependency'));
                            testValueMemoGetFn = memosProvider('testValue', { dependencies: [ 'testDependency' ] }, $q => $q.resolve(testValue));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testDependencyMemo = $injector.instantiate(testDependencyMemoGetFn);
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            testValue = 'New Test Value';

                            testDependencyMemo.reset();

                            // Then
                            expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                            $rootScope.$digest();
                        });
                    });
                });

                describe('resetDependants()', () => {
                    it('should reset the dependants of the memo', done => {
                        let testValue, testDependencyMemoGetFn, testValueMemoGetFn;

                        module(memosProvider => {
                            testValue = 'Test Value';

                            testDependencyMemoGetFn = memosProvider('testDependency', $q => $q.resolve('Test Dependency'));
                            testValueMemoGetFn = memosProvider('testValue', { dependencies: [ 'testDependency' ] }, $q => $q.resolve(testValue));
                        });

                        inject(($injector, $rootScope) => {
                            // Given
                            let testDependencyMemo = $injector.instantiate(testDependencyMemoGetFn);
                            let testValueMemo = $injector.instantiate(testValueMemoGetFn);

                            testValueMemo();

                            $rootScope.$digest();

                            // When
                            testValue = 'New Test Value';

                            testDependencyMemo.resetDependants();

                            // Then
                            expect(testValueMemo()).to.eventually.equal('New Test Value').and.notify(done);

                            $rootScope.$digest();
                        });
                    });
                });
            });
        });
    });
});