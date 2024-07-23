/**
 * Created by ganyang on 2019-04-08.
 */
// import moment from 'moment'
// import 'moment/locale/zh-cn'
// import {
//     flatMapDeep
// } from 'lodash'
// // import translation from './translation'

// export const toDisplayDate = function(dateTime) {
//     if (!dateTime) return ''
//     return moment(dateTime).format('YYYY-MM-DD')
// }
// export const toDisplayTime = function(dateTime) {
//     if (!dateTime) return ''
//     return moment(dateTime).format('YYYY-MM-DD HH:mm')
// }

export const toMyApplyWorkStatus = function(obj) {
  let status = '待发起'
  if (obj.bpmStatus === '1') {
    status = '待提交'
  }
  if (obj.bpmStatus === '2') {
    status = obj.currentNode
  }
  if (obj.bpmStatus === '3') {
    status = '已完成'
  }
  if (obj.bpmStatus === '4') {
    status = '已作废'
  }
  if (obj.bpmStatus === '5') {
    status = '已挂起'
  }
  return status
}
