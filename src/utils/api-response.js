class ApiResponse {
    constructor(statusCode,data,message = "sucess"){
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400 ; // it means if status code is below 400 than  it is valid
    }
}

export {ApiResponse} ; 