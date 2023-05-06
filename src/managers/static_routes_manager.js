import { ManagerBase } from './base_manager';

const staticRoutesGroup = '/routes/static';

export class StaticRoutesManager extends ManagerBase {
    List(onSuccess, onFail) {
        this.doGetApi(staticRoutesGroup)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    AddRoute(data, onSuccess, onFail) {
        this.doPostApi(staticRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    UpdateRoute(data, onSuccess, onFail) {
        this.doPutApi(staticRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }

    DeleteRoute(params, onSuccess, onFail) {
        this.doDeleteApi(staticRoutesGroup, params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }
}
