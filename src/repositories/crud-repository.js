const { Logger } = require("../config");
const { RawString } = require("../utils/rawstring");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        const response = await this.model.create(data);
        return response;
    }

    async destroy(data) {
        try {
            const response = await this.model.destroy({
                where: {
                    id: data
                }
            });
            return response;
        }
        catch (error) {
            // Logger.error("Something went wrong in CRUD repo: destroy function");
            Logger.error(RawString.messages.CRUD_DESTROY_ERROR);
            throw error;
        }
    }


    async get(pk) {
        try {
            const response = await this.model.findByPk(pk);
            return response;
        }
        catch (error) {
            // Logger.error("Something went wrong in CRUD repo: get function");
            Logger.error(RawString.messages.CRUD_GET_ERROR);
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await this.model.findAll();
            return response;
        }
        catch (error) {
            // Logger.error("Something went wrong in CRUD repo: getAll function");
            Logger.error(RawString.messages.CRUD_GET_ALL_ERROR);
            throw error;
        }
    }


    async update(id, data) { // data => {column: value, .....}
        try {
            const response = await this.model.update(data, {
                where: {
                    id: id
                }
            });
            return response;
        }
        catch (error) {
            // Logger.error("Something went wrong in CRUD repo: getAll function");
            Logger.error(RawString.messages.CRUD_UPDATE_ERROR);
            throw error;
        }
    }
};


module.exports = CrudRepository;