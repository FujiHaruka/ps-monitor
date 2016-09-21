#!/usr/bin/env node
const mailer = require('nodemailer')
const { exec } = require('child_process')
const { smtpConfig, mailOptions, monitorConfig } = require('./config')

// プロセスの自動リスタートした Date を管理するキュー
let restartQue = []

setInterval(() => {
  let cmd = `ps aux | grep '[ ]${monitorConfig.command}'`
  exec(cmd, (err, stdout, stderr) => {
    if (err) {
      // Process is dead
      doWhenDead()
    }
  })
}, 1000 * monitorConfig.interval)

function doWhenDead () {
  let {command, sendMail, autoRestart, customCommands, restartLimit} = monitorConfig
  if (sendMail) {
    let transporter = mailer.createTransport(smtpConfig)
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Send Mail Error: ', err)
      }
    })
  }

  if (autoRestart) {
    if (restartQue.length > 0) {
      let latest = restartQue[0]
      let shouldShift = Date.now() - latest > 60 * 60 * 1000 // 1時間
      if (shouldShift) {
        restartQue.shift()
      }
    }
    let shouldRestart = restartQue.length < restartLimit
    if (shouldRestart) {
      // 子プロセスが死んだら親プロセスも死ぬ？
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('Restart Process Error: ', err)
        }
      })
      restartQue.push(Date.now())
    }
  }

  if (customCommands.length > 0) {
    // TODO 実装
  }
}
