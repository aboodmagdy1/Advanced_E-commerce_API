const asyncHandler = require("express-async-handler");
const AppError = require("../util/AppError");
const ApiFeatures = require("../util/apiFeatures");

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filterObject = {};
    if (req.filterObj) {
      filterObject = req.filterObj;
    }
    //build query
    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filterObject), req.query)
      .paginate(documentsCount)
      .filter()
      .sort()
      .limitFields()
      .search(modelName);

    //excute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;
    res.status(200).json({
      status: "success",
      paginationResult,
      results: documentsCount,
      data: documents,
    });
  });

exports.getOne = (Model, populationOption) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    //build query
    let query = Model.findById(id);
    if (populationOption) {
      query = query.populate(populationOption);
    }
    //execute query
    const document = await query;
    if (!document) {
      return next(new AppError(`No document wiht this id : ${id}`, 404));
    }

    res.status(200).json({ status: "success", data: document });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    try {
      const newDoc = await Model.create(req.body);

      res.status(201).json({ status: "success", data: { newDoc } });
    } catch (e) {
      res.status(400).json({ status: "error", errMessage: e.message });
    }
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new AppError(`No document wiht this id : ${req.params.id}`, 404)
      );
    }
    //Triger the (save) Event when update the document (schema.post("save"))
    document.save()
    res.status(200).json({ status: "success", data: document });
  });
exports.deleteOne = (Modle) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Modle.findOneAndDelete({_id:id})
    
    if (Modle === "User") {
      document.active = false;
      // res.status(204).send();
    }
    if (!document) {
      return next(new AppError(`No document wiht this id : ${id}`, 404));
    }
    res.status(204).send();
  });
