# ember-scopes

This is a simple addon to use Rails style model scopes for classes.

Concepts:

- Owner: this is a registry where you can lookup global objects, its just passed to Scopes, you can ignore it if
  you don't need global lookups.
- ClientWrapper: A Class that implements all the finishers, it serves as a middleware for the actual client like
  the ember data store or any other client you might be using.
- Scope: A function that returns a function or a Pojo with local and remote functions
- Query: A proxy that let us build the query step by step to finally execute any of the ClientWrapper finishers

```ts
//Lets say this is our ember data store, or any class with final finishers
const StoreService = {
  peekAll(modelName) {
    return [
      { name: 'Alberto', age: 15 },
      { name: 'Daniel', age: 30 },
      { name: 'Humberto', age: 50 },
    ];
  },
};

//First lets define a custom ClientWrapper that will act as middleware to the provided client
class StoreWrapper extends ClientWrapper {
  peekAll(queries, klass, opts) {
    //[{ name: 'Alberto', age: 15 }, { name: 'Daniel', age: 30 }, { name: 'Humberto', age: 50 }]
    const collection = this.client.peekAll();

    //Local filtering is a helper function which executes all of the callbacks
    //But you can basically do whatever you need here
    return this.localFiltering(collection, queries);
  }
}

//Create an instance
const Wrapper = new StoreWrapper(StoreService);

//Maybe you want to pass getOwner(this), or use it as context
const owner = {};

//Finally you can create an Object or a Class where your scopes live.
class ClassWithScopes {
  @scope
  lessThan(owner, prop, n) {
    return {
      local: (record) => record[prop] < n,
      remote: () => {
        return {
          //or whatever your server receives
          [`${prop}`]: { lt: n },
        };
      },
    };
  }

  @scope
  biggerThan(owner, prop, n) {
    return {
      local: (record) => record[prop] > n,
      remote: () => {
        return {
          //or whatever your server receives
          [`${prop}`]: {
            gt: n,
          },
        };
      },
    };
  }
}

//Finally we create the query
let q = Query(owner, Wrapper, ClassWithScopes);

//And use it.
q.lessThan('age', 10).biggerThan(20).peekAll(); // []

let q = Query(owner, Wrapper, ClassWithScopes);
q.lessThan('age', 50).biggerThan(20).peekAll(); // [{ name: 'Daniel', age: 30 }]
```

It's recommended for ergonomics that you hide the complexity of creating queries behind a service or util, for instance the ember data store.
This addon comes with a built in EmberDataStoreClientWrapper for convenience

```ts
import { EmberDataStoreClientWrapper, Query } from 'ember-scopes';

export default class Store extends EDStore {
  for(modelName) {
    let ModelKlass = this.modelFor(modelName);
    return Query(getOwner(this), EmberDataStoreClientWrapper(this), ModelKlass);
  }
}

//Now you can just do
class ComponentA extends GlimmerComponent {
	@service store;

	constructor() {
		super(...arguments);
		//We suppose Model User Class have a scope defined.
		this.store.for('user').biggerThan('age', 10).peekAll();
	}
}
```

## Compatibility

- Ember.js v3.20 or above
- Ember CLI v3.20 or above
- Node.js v12 or above

## Installation

```
ember install ember-scopes
```

## Usage

[Longer description of how to use the addon in apps.]

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
