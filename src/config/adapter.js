// 适配器
const fileCache = require('think-cache-file');
const fileSession = require('think-session-file');
const {Console, File, DateFile} = require('think-logger3');
const path = require('path');
const isDev = think.env === 'development';
/**
 * 缓冲
 * cache adapter config
 * @type {Object}
 */
exports.cache = {
  type: 'file',
  common: {
    timeout: 24 * 60 * 60 * 1000 // millisecond毫秒
  },
  file: {
    handle: fileCache,
    cachePath: path.join(think.ROOT_PATH, 'runtime/cache'), // absoulte path is necessarily required缓冲文件存放目录
    pathDepth: 1,
    gcInterval: 24 * 60 * 60 * 1000 // gc interval 清理过期缓冲定时时间
  }
};

/**
 * 关系数据库Mysql
 * model adapter config
 * @type {Object}
 */
exports.model = require('./model');

/**
 * 会话
 * session adapter config
 * @type {Object}
 */
exports.session = {
  type: 'file',
  common: {
    cookie: {
      name: 'thinkjs',
      keys: ['signature key'],
      signed: true
    }
  },
  file: {
    handle: fileSession,
    sessionPath: path.join(think.ROOT_PATH, 'runtime/session')
  }
};

/**
 * 视图
 * view adapter config
 * @type {Object}
 */
// 视图的 adapter 名称为 view
exports.view = require('./view');

/**
 * 日志输出
 * logger adapter config
 * @type {Object}
 */
exports.logger = {
  type: isDev ? 'console' : 'dateFile',
  console: {
    handle: Console
  },
  file: {
    handle: File,
    backups: 10, // max chunk number
    absolute: true,
    maxLogSize: 50 * 1024, // 50M
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  },
  dateFile: {
    handle: DateFile,
    level: 'ALL',
    absolute: true,
    pattern: '-yyyy-MM-dd',
    alwaysIncludePattern: true,
    filename: path.join(think.ROOT_PATH, 'logs/app.log')
  }
};
