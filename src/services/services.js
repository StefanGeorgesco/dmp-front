import axios from "axios";
import { Buffer } from "buffer";
import { useAuthUserStore } from '../stores/authUserStore.js';

axios.interceptors.request.use(request => {

    const store = new useAuthUserStore();

    if (store.authorization) {
        request.headers.common.Authorization = store.authorization;
    }

    return request;
});

export class Service {

    static login(user) {
        let headers = {
            'Authorization': 'Basic ' + Buffer.from(user.username + ':' + user.password, 'utf8').toString('base64'),
            'X-Requested-With': 'XMLHttpRequest'
        };

        return axios.post("/dmp/login", null, { headers });
    };

    static getPatientFileDetails() {
        return axios.get("/dmp/patient-file/details");
    }

}