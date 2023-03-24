const index = async (req, res, next, model, attr) => {
    try {
        if (attr.path)
            var data = await model
                .find({})
                .select("-passwordHash")
                .populate(attr.path)
                .exec();
        else var data = await model.find({}).select("-passwordHash");
        const count = await model.count({});

        if (!count) {
            res
                .status(404)
                .send({ message: "Data Not Found", responseStatus: 0 });
        } else {
            res
                .status(200)
                .send({ data: data, count: count, responseStatus: 1 });
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error, responseStatus: 0 });
    }
};

const create = async (req, res, next, model) => {
    try {
        const result = new model({ ...req.body });
        const data = await result.save();
        res
            .status(201)
            .send({
                success: true,
                _id: data._id,
                data: data,
                message: "Created/Added Successfully",
                responseStatus: 1,
            });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: error, responseStatus: 0, success: false });
    }
};

const bulkCreate = async (req, res, next, model) => {
    try {
        const data = await model.insertMany(req.data);
        res
            .status(201)
            .send({
                success: true,
                message: "Bulk Data Added Successfully",
                responseStatus: 1,
                data: data
            });
    } catch (error) {
        res.status(500).send({ message: error, responseStatus: 0 });
    }
};

const show = async (req, res, next, model, attr) => {
    try {
        var data
        if (attr.path) {
            data = await model.findById(req.params.id).populate(attr.path).exec();
        }
        else {
            data = await model.findById(req.params.id);
        }
        if (!data) {
            res
                .status(404)
                .send({ response: { message: "Data Not Found", responseStatus: 0 } });
        } else {
            res.status(200).send({ data: data, responseStatus: 1 });
        }
    } catch (error) {
        res.status(500).send({ message: error, responseStatus: 0 });
    }
};

const update = async (req, res, next, model) => {
    try {
        const data = await model.findByIdAndUpdate(req.params.id, req.body);
        if (!data) {
            res
                .status(404)
                .send({ message: "Data Not Found", responseStatus: 0 });
        } else {
            res
                .status(202)
                .send({
                    success: true,
                    message: "Updated successfully",
                    responseStatus: 1,
                });
        }
    } catch (error) {
        res.status(500).send({ message: error, responseStatus: 0 });
    }
};

const destroy = async (req, res, next, model) => {
    try {
        const data = await model.findByIdAndDelete(req.params.id);
        if (!data) {
            res
                .status(404)
                .send({
                    message: "Data Not Found for deletion",
                    responseStatus: 0,
                });
        } else {
            res
                .status(202)
                .send({
                    success: true,
                    message: "deleted successfully",
                    responseStatus: 1,
                });
        }
    } catch (error) {
        res.status(500).send({ message: error, responseStatus: 0 });
    }
};

module.exports = { index, create, bulkCreate, show, update, destroy };
