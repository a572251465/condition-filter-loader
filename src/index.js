// eslint-disable-next-line import/no-extraneous-dependencies
const loaderUtils = require('loader-utils')
const path = require('path')

function isAssignType(value) {
  return typeof value === 'string' || Array.isArray(value)
}

function loopHandle(checkArr, value) {
  const checkPolicy = {
    string(checkVal, inputVal) {
      return !!~inputVal.indexOf(checkVal)
    },
    regexp(inputVal, checkVal) {
      return inputVal.test(checkVal)
    }
  }
  let i = 0
  let flag = true
  for (; i < checkArr.length; i += 1) {
    const item = checkArr[i]
    const inputVal = /\s+[a-zA-Z]+/gi
      .exec(Object.prototype.toString.call(item).toLowerCase())[1]
      .trim()
    flag =
      typeof checkPolicy[inputVal] === 'function'
        ? checkPolicy[inputVal](item, value)
        : true
    return flag
  }
  return flag
}

function checkFilterCond(config, value) {
  const { include, exclude } = config
  if (!isAssignType(include)) {
    console.warn('param include must be string or array')
    return true
  }
  if (!isAssignType(exclude)) {
    console.warn('param exclude must be string or array')
    return true
  }

  const includes = typeof include === 'string' ? [include] : include
  const excludes = typeof exclude === 'string' ? [exclude] : exclude

  const includeFlag =
    includes.length === 0 ? false : loopHandle(includes, value)
  const excludeFlag =
    excludes.length === 0 ? false : loopHandle(excludes, value)
  return includeFlag || excludeFlag
}

/**
 * @author lihh
 * @param content 源文件
 *  config params. config.projectPath
 *                 config.loader
 *                 config.include
 *                 config.exclude
 *                 config.loaderPath
 * @returns {*}
 */
function conditionFilterLoader(content) {
  const { resourcePath } = this
  const options = loaderUtils.getOptions(this)
  const cwd = process.cwd()
  const { config = {} } = options
  if (!config.loader) {
    return content
  }
  if (!config.include) {
    config.include = []
  }
  if (!config.exclude) {
    config.exclude = []
  }

  if (checkFilterCond(config, resourcePath)) {
    return content
  }

  const loaderPath =
    config.loaderPath ||
    path.resolve(config.projectPath || cwd, `node_modules/${config.loader}`)
  const resolveLoader = require(loaderPath)
  resolveLoader.call(this, content)
}

module.exports = conditionFilterLoader
module.exports.raw = true
