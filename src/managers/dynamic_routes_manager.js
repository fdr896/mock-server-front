import { ManagerBase } from './base_manager';

const dynamicRoutesGroup = '/routes/dynamic';

export class DynamicRoutesManager extends ManagerBase {
    List(onSuccess, onFail) {
        this.doGetApi(dynamicRoutesGroup)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    GetRouteCode(path, onSuccess, onFail) {
        const params = new URLSearchParams([['path', path]]);
        this.doGetApi(dynamicRoutesGroup + '/code', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    AddRoute(data, onSuccess, onFail) {
        this.doPostApi(dynamicRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    UpdateRoute(data, onSuccess, onFail) {
        this.doPutApi(dynamicRoutesGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }

    DeleteRoute(params, onSuccess, onFail) {
        this.doDeleteApi(dynamicRoutesGroup, params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }
}
