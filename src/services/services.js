import axios from "axios";
import { Buffer } from "buffer";

axios.interceptors.request.use(request => {

    let authorization = sessionStorage.getItem('Authorization');

    if (authorization && authorization !== 'null') {
        request.headers.common.Authorization = authorization;
    }

    return request;
});

export class Service {

    static login(user) {
        let headers = { 'Authorization': 'Basic ' + Buffer.from(user.email + ':' + user.password, 'utf8').toString('base64') };
        //let headers = { 'Authorization': 'Basic dXNlcjoxMjM0 ' };

        return axios.post("/dmp/login", null, { headers });
    }
}