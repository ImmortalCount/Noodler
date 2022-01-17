import axios from "axios";

//local "http://localhost:5000/api/"
export default axios.create({
    baseURL: "https://noodler-backend.herokuapp.com/api/",
    headers: {
        "Content-type": "application/json"
    }
})