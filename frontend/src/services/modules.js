import http from "../http-common.js";

class ModuleDataService {
    getAll(){
        return http.get(`/`);
    }
}

export default new ModuleDataService();