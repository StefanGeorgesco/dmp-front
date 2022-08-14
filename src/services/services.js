import axios from "axios";
import { Buffer } from "buffer";
import { useAuthUserStore } from "../stores/authUserStore.js";

axios.interceptors.request.use((request) => {
  const store = useAuthUserStore();

  if (store.authorization) {
    request.headers.common.Authorization = store.authorization;
  }

  return request;
});

const baseUrl = "/dmp";

export class Service {
  static login(user) {
    let headers = {
      Authorization:
        "Basic " +
        Buffer.from(user.username + ":" + user.password, "utf8").toString(
          "base64"
        ),
      "X-Requested-With": "XMLHttpRequest",
    };

    return axios.post(`${baseUrl}/login`, null, { headers });
  }

  static signUp(user) {
    return axios.post(`${baseUrl}/user`, user);
  }

  static addPatientFile(patientFile) {
    return axios.post(`${baseUrl}/patient-file`, patientFile);
  }

  static addDoctor(doctor) {
    return axios.post(`${baseUrl}/doctor`, doctor);
  }

  static getSpecialties() {
    return axios.get(`${baseUrl}/specialty`);
  }

  static getDoctorDetails() {
    return axios.get(`${baseUrl}/doctor/details`);
  }

  static getPatientFileDetails() {
    return axios.get(`${baseUrl}/patient-file/details`);
  }

  static updateDoctorDetails(doctor) {
    return axios.put(`${baseUrl}/doctor/details`, doctor);
  }

  static updatePatientFileDetails(patientFile) {
    return axios.put(`${baseUrl}/patient-file/details`, patientFile);
  }
}
