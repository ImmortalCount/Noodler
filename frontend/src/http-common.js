import axios from "axios";
//prod "https://noodler-backend.herokuapp.com/api/"
//local "http://localhost:5000/api/"
export default axios.create({
    baseURL: "http://localhost:5000/api/",
    headers: {
        "Content-type": "application/json"
    }
})