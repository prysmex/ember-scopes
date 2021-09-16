import Service from '@ember/service';
import { EmberDataStoreClient, Query } from 'ember-scopes';
import { getOwner } from '@ember/application';

export default class StoreService extends Service {
  for(modelNameOrKlass) {
    let Klass =
      typeof modelNameOrKlass === 'string'
        ? this.modelFor(modelNameOrKlass)
        : modelNameOrKlass;
    return new Query(getOwner(this), new EmberDataStoreClient(this), Klass);
  }

  peekAll() {
    return [10, 20, 30, 40, 50];
  }
}
