let series = require('run-series')
let sandbox = require('@architect/sandbox')

let http = 0
let events = 0
let tables = 0

let fail = err => {
  console.log(err)
  process.exit(1)
}

let httpOps = callback => {
  return callback => {
    let s = Date.now()
    sandbox.http.start({ quiet:true }, err => {
      if (err) callback(err)
      else {
        http += (Date.now() - s)
        sandbox.http.end(callback)
      }
    })
  }
}
let eventsOps = callback => {
  return callback => {
    let s = Date.now()
    sandbox.events.start({ quiet:true }, err => {
      if (err) callback(err)
      else {
        events += (Date.now() - s)
        sandbox.events.end(callback)
      }
    })
  }
}
let tablesOps = callback => {
  return callback => {
    let s = Date.now()
    sandbox.tables.start({ quiet:true }, err => {
      if (err) callback(err)
      else {
        tables += (Date.now() - s)
        sandbox.tables.end(callback)
      }
    })
  }
}

let ops = [
  ...Array.from({length: 100}, httpOps),
  ...Array.from({length: 100}, eventsOps),
  ...Array.from({length: 100}, tablesOps),
]
let start = Date.now()

console.log('(Re)starting services!')
series(ops, err => {
  if (err) fail(err)
  else {
    console.log(`Restarted http 100 times in ..... ${http}ms`)
    console.log(`Restarted events 100 times in ... ${events}ms`)
    console.log(`Restarted tables 100 times in ... ${tables}ms`)
    console.log(`Ran for a total of .............. ${Date.now() - start}ms`)
  }
})
