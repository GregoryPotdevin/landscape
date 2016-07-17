import keys from 'lodash/keys'
import moment from 'moment'

export function guessType(value){
  if ((typeof value) === 'string'){
    if (value.match(/^http(s)?:\/\/[^ ]+(bmp|png|jpg|jpeg|gif)$/)
    || value.match(/^\/[^ ]+(bmp|png|jpg|jpeg|gif)$/)){
      return { type: 'image' }
    } else if (value.match(/^http(s)?:\/\/[^ ]+$/)){
      return { type: 'url' }
    } else if (moment(value, [
        moment.ISO_8601,   
        "YYYY-MM-DD",
        "YYYY/MM/DD",
      ], true).isValid()){
      return { type: 'date' }
    } else {
      return { type: 'string' }
    }
  } else if ((typeof value) === 'number'){
    return {type: 'number'}
  } else {
    return {type: 'unknown'}
  }
}

// TODO : do in a single pass ?
export function extractKeys(data){
  const dataKeys = []
  keys(data).forEach(k => {
    if ((typeof(data[k]) === "string") || (typeof(data[k]) === "number")) {
      const typeInfo = guessType(data[k])
      const field = {
        key: k,
        type: typeInfo.type,
        value: data[k]
      }
      if (typeInfo.subtype !== undefined){
        field.subtype = typeInfo.subtype
      }
      dataKeys.push(field)
    } else if (typeof(data[k] === "object")) {
      extractKeys(data[k]).forEach(({key: subkey, type, value}) => {
        dataKeys.push({
          key: k + '.' + subkey,
          type, value 
        })
      })
    }
  })
  return dataKeys;
}

export function findItems(data){
  if (!data) return undefined
  else if (Array.isArray(data)) return data
  else if (data.items && Array.isArray(data.items)) return data.items
  else if (data.records && Array.isArray(data.records)) return data.records
  else if (data.hits && data.hits.hits) return data.hits.hits
  else return undefined
}

export function analyseJson(data){
  const items = findItems(data)
  return {
    data, items,
    itemKeys: (!items || items.length == 0) ? [] : extractKeys(items[0])
  }
}