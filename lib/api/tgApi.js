'use strict';
const crypto = require('crypto');
const TelegramBot = require('node-telegram-bot-api');
const {
  DobLogApi
} = require('@dob/log');

class TgApi {
  static botMap = {};

  /**
   * @description 创建Bot
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {String} param1.name Bot名称
   * @param {Object} param1.config Bot配置
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {Boolean} 是否创建成功
   */
  static createBot(
    {
      name,
      config
    },
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'DobTgApi::createBot';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      if(this.botMap[name] === undefined) {
        let bot = new TelegramBot(config.token, config.options);
        this.botMap[name] = bot;
      }

      return true;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return false;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 获取Bot
   * 
   * @static
   * 
   * @param {Object} param1
   * @param {String} param1.name Bot名称
   * @param {Object} param2
   * @param {Boolean} [param2.throwErrorFlag = true] 抛出错误标志
   * 
   * @returns {Object} Bot
   */
  static getBot(
    {
      name
    },
    {
      throwErrorFlag = true
    } = {}
  ) {
    const identifier = 'DobTgApi::getBot';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      return this.botMap[name] !== undefined ? this.botMap[name] : null;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 解析miniApp initData
   */
  static parseMiniAppInitData(
    {
      initData
    },
    {
      throwErrorFlag = true,
      ctx
    } = {}
  ) {
    const identifier = 'DobTgApi::parseMiniAppInitData';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      let data = {};
      decodeURIComponent(initData).split('&').forEach(
        item => {
          const [key, value] = item.split('=');
          data[key] = value;
        }
      );

      //返回
      return data;
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }


  /**
   * @description 校验hash
   */
  static checkHash(
    {
      data
    },
    {
      throwErrorFlag = true,
      ctx
    } = {}
  ) {
    const identifier = 'DobTgApi::checkHash';
    
    //获取日志器
    const logger = DobLogApi.getLogger(
      {
        category: identifier
      }
    );
    
    //开始执行
    logger?.debug(`=====开始执行${identifier}=====`);
    
    try {
      //遍历机器人
      for(let key in this.botMap) {
        let bot = this.botMap[key];
        let token = bot.token;
        let secret = crypto.createHmac('sha256', 'WebAppData').update(token).digest();
        let checkString = Object.keys(data)
        .filter(key => key !== 'hash')
        .sort()
        .map(
          (key) => {
            return `${key}=${data[key]}`
          }
        )
        .join('\n');
        let localHash = crypto.createHmac('sha256', secret).update(checkString).digest('hex');

        if(localHash === data.hash) {
          return key;
        }
      }

      throw new Error('Hash校验失败');
    }
    catch(error) {
      //抛出错误
      if(throwErrorFlag === true) {
        throw error;
      }
      //返回
      else {
        return null;
      }
    }
    finally {
      //结束执行
      logger?.debug(`=====结束执行${identifier}=====`);
    }
  }
}

module.exports = TgApi;