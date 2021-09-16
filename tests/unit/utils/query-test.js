import { Query, scope, ClientWrapper } from 'ember-scopes';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Utility | query', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function (assert) {
    this.Client = {
      peekAll() {
        return [
          {
            name: 'Alberto',
            age: 25,
          },
          {
            name: 'Humberto',
            age: 50,
          },
          { name: 'Roberto', age: 75 },
          { name: 'Heriberto', age: 100 },
        ];
      },
    };

    class Wrapper extends ClientWrapper {
      peekAll(queries) {
        const collection = this.client.peekAll();
        return this.localFiltering(collection, queries);
      }
    }

    this.Wrapper = new Wrapper(this.Client);

    this.MathScopes = class ClassWithMathScopes {
      @scope
      static biggerThan(_owner, prop, val) {
        return {
          local: (record) => {
            return record[prop] > val;
          },
          remote: () => ({}),
        };
      }

      @scope
      static lessThan(_owner, prop, val) {
        return {
          local: (record) => {
            return record[prop] < val;
          },
          remote: () => ({}),
        };
      }

      @scope
      static withName(_owner, name) {
        return (record) => record.name === name;
      }
    };
  });

  test('it can instantiate a Query', async function (assert) {
    let query = Query(this.owner, this.Wrapper, this.MathScopes);
    assert.ok(query);
  });

  test('it calls the finishers', async function (assert) {
    assert.expect(4);
    class AssertFinishersWrapper extends ClientWrapper {
      firstFinisher() {
        assert.ok(true, 'called firstFinisher');
      }
      secondFinisher() {
        assert.ok(true, 'called secondFinisher');
      }
      thirdFinisher() {
        assert.ok(true, 'called thirdFinisher');
      }
      fourthFinisher() {
        assert.ok(true, 'called fourthFinisher');
      }
    }

    let query = Query(
      this.owner,
      new AssertFinishersWrapper({}),
      this.MathScopes
    );

    query.firstFinisher();
    query.secondFinisher();
    query.thirdFinisher();
    query.fourthFinisher();
  });

  test('it can chain scopes before finishers', async function (assert) {
    let query = Query(this.owner, this.Wrapper, this.MathScopes);

    query.biggerThan('age', 10).lessThan('age', 100);

    assert.ok(query.peekAll(), 'It can chain scopes');
  });
  test('it saves the scopes', async function (assert) {
    let query = Query(this.owner, this.Wrapper, this.MathScopes);

    query
      .biggerThan('age', 10)
      .lessThan('age', 100)
      .biggerThan('age', 50)
      .lessThan('age', 90)
      .biggerThan('age', 80)
      .lessThan('age', 85);

    assert.equal(query.queries.length, 6, 'It saves the scopes correctly');
  });

  test('it filters the collection correctly', async function (assert) {
    let query = Query(this.owner, this.Wrapper, this.MathScopes);

    query
      .biggerThan('age', 10)
      .lessThan('age', 100)
      .biggerThan('age', 50)
      .lessThan('age', 85);

    assert.deepEqual(
      query.peekAll(),
      [{ name: 'Roberto', age: 75 }],
      'It filtered the collection correctly'
    );
  });
});
