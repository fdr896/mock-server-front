import { ManagerBase } from './base_manager';

const proxyRoutesGroup = '/routes/proxy';

export class ProxyRoutesManager extends ManagerBase {
    List(onSuccess, onFail) {
        this.doGetApi(proxyRoutesGroup)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    AddRoute(data, onSuccess, onFail) {
        this.doPostApi(proxyRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    UpdateRoute(data, onSuccess, onFail) {
        this.doPutApi(proxyRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }

    DeleteRoute(params, onSuccess, onFail) {
        this.doDeleteApi(proxyRoutesGroup, params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }
}
