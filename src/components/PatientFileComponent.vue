<template>
    <table class="table">
        <tr>
            <th>id</th>
            <th>firstname</th>
            <th>lastname</th>
            <th>phone</th>
            <th>email</th>
            <th>address street</th>
            <th>address city</th>
            <th>date of birth</th>
            <th>referring doctor</th>
        </tr>
        <tr>
            <td>{{ patientFile.id }}</td>
            <td>{{ patientFile.firstname }}</td>
            <td>{{ patientFile.lastname }}</td>
            <td>{{ patientFile.phone }}</td>
            <td>{{ patientFile.email }}</td>
            <td>{{ patientFile.address.street1 }}</td>
            <td>{{ patientFile.address.city }}</td>
            <td>{{ patientFile.dateOfBirth }}</td>
            <td>{{ patientFile.referringDoctorId }}</td>
        </tr>
    </table>
</template>

<script>
import { Service } from '../services/services.js';

export default {
    name: "PatientFileComponent",
    data() {
        return {
            patientFile: {}
        }
    },
    async created() {
        try {
            let response = await Service.getPatientFileDetails();
            this.patientFile = response.data;
        } catch (error) {

        }
        
    }
}
</script>

<style>

</style>