const express = require("express");
const uuid = require("uuid");
const errors = require("../errors");

module.exports = class MapRouter {
  constructor(config){
    // set base path
    this.basePath = "/maps";
    // set true if require authorized
    this.requireAuth = false;

    const router = this.router = express.Router();

    router.get("/",           this.getMaps);
    router.post("/",          this.createMap);

    router.get("/:mapId",     this.getMap);
    router.put("/:mapId",     this.modifyMap);
    router.delete("/:mapId",  this.deleteMap);

    router.get("/:mapId/markers",    this.getMarkers);
    router.post("/:mapId/markers",   this.createMarker);

    router.get("/:mapId/calibrates",          this.getCalibrates);
    router.get("/:mapId/calibrates/:pointId", this.calibrate);
  }

  // implementations
  getMaps(req, res, next){
    req.model.Map.fetchAll().then((users)=>{
      res.json(users);
    }).catch(next);
  }
  createMap(req, res, next){
    // const [err, validated] = req.model.Map.precheck.validateSync(req.body);
    // if(err) return next(new errors.InvalidParameterError());
    return new req.model.Map({path: req.body.path}).save().then((map)=>{
      res.status(201).json(map);
    }).catch(next);
  }
  getMap(req, res, next){
  }
  modifyMap(req, res, next){
  }
  deleteMap(req, res, next){
  }

  getMarkers(req, res, next){
  }
  createMarker(req, res, next){
  }
  getCalibrates(req, res, next){
  }
  calibrate(req, res, next){
  }
  testCalibration(req, res, next){
  }
};
