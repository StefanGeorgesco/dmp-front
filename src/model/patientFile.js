export class PatientFile {

    constructor(id, firstname, lastname, phone, email, address, securityCode, dateOfBirth, referringDoctor) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.securityCode = securityCode;
        this.dateOfBirth = dateOfBirth;
        this.referringDoctor = referringDoctor;
    }

}