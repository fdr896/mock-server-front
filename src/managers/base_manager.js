import axios from 'axios';

const BackendEndpoint = 'http://62.84.125.40';

export function InitManagers() {
    axios.defaults.mode = 'no-cors';
    axios.defaults.validateStatus = (status) => {
        return status < 500;
    }
}

export class ManagerBase {
    async doGetApi(route) {
        const url = '/api' + route;

        return await this.doGet(url);
    }

    async doPostApi(route, data) {
        const url = '/api' + route;

        return await this.doPost(url, data);
    }

    async doPutApi(route, data) {
        const url = '/api' + route;

        return await this.doPut(url, data);
    }

    async doDeleteApi(route, params) {
        const url = '/api' + route;

        return await this.doDelete(url, params);
    }

    async doGet(route) {
        const url = BackendEndpoint + route;

        try {
            const response = await axios.get(url);
            console.debug(`GET ${route} returned: status: ${response.status},\n data: ${JSON.stringify(response.data)}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            console.error(`GET ${route} failed:\n ${error}`);
            throw error;
        }
    }

    async doPost(route, data) {
        const url = BackendEndpoint + route;

        try {
            const response = await axios.post(url, data);
            console.debug(`POST ${route} returned: status: ${response.status},\n data: ${JSON.stringify(response.data)}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            console.log(`POST ${route} failed:\n ${error}`);
            throw error;
        }
    }

    async doPut(route, data) {
        const url = BackendEndpoint + route;

        try {
            const response = await axios.put(url, data);
            console.debug(`PUT ${route} returned: status: ${response.status},\n data: ${JSON.stringify(response.data)}`);
            return {
                status: response.status,
                data: response.data
            };
        } catch (error) {
            console.log('PUT ${route} failed:\n ${error}');
            throw error;
        }
    }

    async doDelete(route, params) {
        const url = BackendEndpoint + route;

        try {
            const response = await axios.delete(url, {params: params});
            console.debug(`DELETE ${route} returned: status: ${response.status},\n data: ${JSON.stringify(response.data)}`);
            return {
                status: response.status,
                data: response.data,
            };
        } catch (error) {
            console.log(`DELETE ${route} failed:\n ${error}`);
            throw error;
        }
    }
}
