const SensorTag = require("sensortag");
const debug = require("debug")("sensortag");
const config = require("config");
const Logger = require("fluent-logger");

const interval = process.env.INTERVAL || 1000;
const logger = Logger.createFluentSender("es.sensortag", {
  host: process.env.FLUENT_HOST || config.fluentd.host || "localhost",
  port: process.env.FLUENT_PORT || config.fluentd.port || 24224,
  timeout: process.env.FLUENT_TIMEOUT || config.fluentd.timeout || 3.0,
  reconnectInterval: process.env.FLUENT_RECONNECT_INTERVAL || config.fluentd.reconnect_interval || 600000
});

const emitLog = ((logger)=>{
  return (tag, data)=>{
    if(typeof data === "string") data = {message: data};
    console.log(`${tag}: ${JSON.stringify(data)}`);
    logger.emit(tag, data);
  };
})(logger);

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

    watch(interval, "IrTemperature", tag, (objTemp, ambTemp)=>{
      emitLog("tag", {objTemp, ambTemp, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "Accelerometer", tag, (ax, ay, az)=>{
      emitLog("tag", {ax, ay, az, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "Humidity", tag, (temp, hum)=>{
      emitLog("tag", {temp, hum, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "Magnetometer", tag, (mx, my, mz)=>{
      emitLog("tag", {mx, my, mz, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "BarometricPressure", tag, (pressure)=>{
      emitLog("tag", {pressure, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "Gyroscope", tag, (gx, gy, gz)=>{
      emitLog("tag", {gx, gy, gz, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });

    watch(interval, "Luxometer", tag, (lux)=>{
      emitLog("tag", {lux, tag: tag.address});
    }).catch((err)=>{
      console.log(err);
    });
  });
});
