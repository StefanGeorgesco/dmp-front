import axios from "axios";
import { Buffer } from "buffer";
import { useAuthUserStore } from "../stores/authUserStore.js";
import { useMessagesStore } from "../stores/messagesStore.js";

const baseUrl = "/dmp";

let router;

import("../router").then((obj) => (router = obj.default));

axios.interceptors.request.use((request) => {
  const authStore = useAuthUserStore();

  if (authStore.authorization) {
    request.headers.common.Authorization = authStore.authorization;
  }
  if (
    ["post", "put"].includes(request.method) &&
    request.url !== `${baseUrl}/login`
  ) {
    request.headers["Content-Type"] = "application/json";
  }
  request.headers["X-Requested-With"] = "XMLHttpRequest";

  return request;
});

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const authStore = useAuthUserStore();
    const msgStore = useMessagesStore();

    if (
      router.currentRoute.value.name !== "login" &&
      error.response.status === 401
    ) {
      msgStore.setErrorMessage("Vous devez vous reconnecter.");
      authStore.logout();
      router.push("/login");
    } else if (error.response.status >= 500) {
      msgStore.setErrorMessage(
        "Impossible de se connecter au serveur. Veuillez réessayer."
      );
    }
    return Promise.reject(error);
  }
);

export class Service {
  static login(user) {
    let headers = {
      Authorization:
        "Basic " +
        Buffer.from(user.username + ":" + user.password, "utf8").toString(
          "base64"
        ),
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

  static findObjectBySearchString(objectType, q) {
    let uri = encodeURI(`${baseUrl}/${objectType}?q=${q}`);
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

  static addCorrespondence(correspondence) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${correspondence.patientFileId}/correspondence`
    );
    return axios.post(uri, correspondence);
  }

  static deleteCorrespondence(correspondence) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${correspondence.patientFileId}/correspondence/${correspondence.id}`
    );
    return axios.delete(uri);
  }

  static addItem(item) {
    let uri = encodeURI(`${baseUrl}/patient-file/${item.patientFileId}/item`);
    return axios.post(uri, item);
  }

  static updateItem(item) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${item.patientFileId}/item/${item.id}`
    );
    return axios.put(uri, item);
  }

  static deleteItem(item) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${item.patientFileId}/item/${item.id}`
    );
    return axios.delete(uri, item);
  }

  static updateReferringDoctor(patientFileId, referringDoctor) {
    let uri = encodeURI(
      `${baseUrl}/patient-file/${patientFileId}/referring-doctor`
    );
    return axios.put(uri, referringDoctor);
  }
}
