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

  static findDoctorsByIdOrFirstnameOrLastname(q) {
    let uri = encodeURI(`${baseUrl}/doctor?q=${q}`);
    return axios.get(uri);
  }

  static findPatientFilesByIdOrFirstnameOrLastname(q) {
    let uri = encodeURI(`${baseUrl}/patient-file?q=${q}`);
    return axios.get(uri);
  }

  static getDoctor(id) {
    let uri = encodeURI(`${baseUrl}/doctor/${id}`);
    return axios.get(uri);
  }

  static deleteDoctor(id) {
    let uri = encodeURI(`${baseUrl}/doctor/${id}`);
    return axios.delete(uri);
  }

  static deletePatientFile(id) {
    let uri = encodeURI(`${baseUrl}/patient-file/${id}`);
    return axios.delete(uri);
  }

  static getPatientFile(id) {
    let uri;
    if (id) {
      uri = encodeURI(`${baseUrl}/patient-file/${id}`);
    } else {
      uri = encodeURI(`${baseUrl}/patient-file/details`);
    }
    return axios.get(uri);
  }

  static getCorrespondences(patientFileId) {
    let uri;
    if (patientFileId) {
      uri = encodeURI(
        `${baseUrl}/patient-file/${patientFileId}/correspondence`
      );
    } else {
      uri = encodeURI(`${baseUrl}/patient-file/details/correspondence`);
    }
    return axios.get(uri);
  }

  static getItems(patientFileId) {
    let uri;
    if (patientFileId) {
      uri = encodeURI(`${baseUrl}/patient-file/${patientFileId}/item`);
    } else {
      uri = encodeURI(`${baseUrl}/patient-file/details/item`);
    }
    return axios.get(uri);
  }

  static deleteCorrespondence(patientFileId, correspondenceId) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${patientFileId}/correspondence/${correspondenceId}`
    );
    return axios.delete(uri);
  }
}
