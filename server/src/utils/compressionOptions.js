const compressionOptions = {
  // level: -1, //default
  level: 6, // best
  // level: 9, //max
  threshold: 100 * 1000, //do not compress if less than 100KB
};

module.export = compressionOptions;
