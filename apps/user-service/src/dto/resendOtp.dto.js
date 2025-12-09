class ResendOtpDTO {
    constructor ({email}){
        this.email = email
    }
    validate(){
        if(!this.email)throw new Error("Email is required");
    }
}

module.exports = ResendOtpDTO;