const SensorTag = require("sensortag");
const debug = require("debug")("sensortag");
const config = require("config");
const logger = require("fluent-logger");

logger.configure("es.sensortag", {
  host: process.env.FLUENT_HOST || config.fluentd.host || "localhost",
  port: process.env.FLUENT_PORT || config.fluentd.port || 24224,
  timeout: process.env.FLUENT_TIMEOUT || config.fluentd.timeout || 3.0,
  timeout: process.env.FLUENT_RECONNECT_INTERVAL || config.fluentd.reconnect_interval || 600000
});

const ATTRS = [
  "IrTemperature",
  "Accelerometer",
  "Humidity",
  "Magnetometer",
  "BarometricPressure",
  "Gyroscope",
  "Luxometer"
];

const exit = (err)=>{
  debug(err.message);
  process.exit(-1);
};

const lowerCamel = (str)=> str[0].toLowerCase() + str.slice(1);

const watch = (period, attr, tag, listener)=>{
  return new Promise((resolve, reject)=>{
    return tag[`enable${attr}`]((err)=>{
      if(err) return reject(err);
      return tag[`set${attr}Period`](period, (err)=>{
        if(err) return reject(err);
        return tag[`notify${attr}`]((err)=>{
          if(err) return reject(err);
          return resolve();
        });
      });
    });
  }).then(()=>{
    tag.on(`${lowerCamel(attr)}Change`, listener);
  });
};

const unwatch = (attr, tag)=>{
  return new Promise((resolve, reject)=>{
    tag[`unnotify${attr}`]((err)=>{
      if(err) return reject(err);
      return resolve();
    });
  });
};


SensorTag.discoverAll((tag)=>{
  tag.onDisconnect(exit);
  tag.connectAndSetUp((err)=>{
    if(err) exit(err);
    debug(`connect SensorTag ${tag._peripheral.id}`);

    watch(1000, "IrTemperature", tag, (objTemp, ambTemp)=>{
      logger.emit("tag", {objTemp, ambTemp, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "Accelerometer", tag, (ax, ay, az)=>{
      logger.emit("tag", {ax, ay, az, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "Humidity", tag, (temp, hum)=>{
      logger.emit("tag", {temp, hum, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "Magnetometer", tag, (mx, my, mz)=>{
      logger.emit("tag", {mx, my, mz, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "BarometricPressure", tag, (pressure)=>{
      logger.emit("tag", {pressure, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "Gyroscope", tag, (gx, gy, gz)=>{
      logger.emit("tag", {gx, gy, gz, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(1000, "Luxometer", tag, (lux)=>{
      logger.emit("tag", {lux, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });
  });
});
