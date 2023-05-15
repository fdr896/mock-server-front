import { ManagerBase } from './base_manager';

const poolBrokersGroup = '/brokers/pool';

export class PoolBrokersManager extends ManagerBase {
    List(onSuccess, onFail) {
        this.doGetApi(poolBrokersGroup)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    GetConfig(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool', pool]]);
        this.doGetApi(poolBrokersGroup + '/config', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    GetReadMessages(pool, onSuccess, onFail) {
        console.log(`POOL: ${pool}`);
        const params = new URLSearchParams([['pool', pool]]);
        this.doGetApi(poolBrokersGroup + '/read', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    GetWriteMessages(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool', pool]]);
        this.doGetApi(poolBrokersGroup + '/write', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    ScheduleRead(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool', pool]]);
        this.doPostApiWithParams(poolBrokersGroup + '/read', params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    ScheduleWrite(data, onSuccess, onFail) {
        this.doPostApi(poolBrokersGroup + '/write', data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    AddPool(data, onSuccess, onFail) {
        this.doPostApi(poolBrokersGroup, data)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        });
    }

    DeletePool(pool, onSuccess, onFail) {
        const params = new URLSearchParams([['pool', pool]]);
        this.doDeleteApi(poolBrokersGroup, params)
        .then(({status, data}) => {
            onSuccess(status, data);
        })
        .catch((error) => {
            onFail(error);
        })
    }
}
