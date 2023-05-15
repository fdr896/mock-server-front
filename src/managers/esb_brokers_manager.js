import { ManagerBase } from './base_manager';

const esbBrokersGroup = '/brokers/esb';

export class EsbBrokersManager extends ManagerBase {
    List(onSuccess, onFail) {
        this.doGetApi(esbBrokersGroup)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    GetCode(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool_in', pool]]);
        this.doGetApi(esbBrokersGroup + '/code', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    ScheduleWrite(data, onSuccess, onFail) {
        this.doPostApi(esbBrokersGroup + '/task', data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    AddRecord(data, onSuccess, onFail) {
        this.doPostApi(esbBrokersGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    DeleteRecord(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool_in', pool]]);
        this.doDeleteApi(esbBrokersGroup, params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }
}
