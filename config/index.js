/**
 * @see https://github.com/nodemailer/nodemailer
 */
const smtpConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: 'example@gmail.com',
    pass: 'pass'
  }
}
const mailOptions = {
  from: smtpConfig.auth.user,
  to: 'foo@example.com',
  subject: 'Process Dead',
  text: 'Process dead. But I am tring to restart.'
}

/**
 * Monitor config
 * command: 監視するコマンド
 * interval: interval 秒ごとにプロセスが生きているか確認する
 * autoRestart: プロセスが死んだら自動的に同じコマンドを実行するか
 * sendMail: プロセスが死んだらメールするか
 * restartLimit: プロセスの自動リスタートを一時間あたり最大何回まで実行するか
 */
const monitorConfig = {
  command: 'node /home/app/app.js',
  interval: 10,
  autoRestart: true,
  sendMail: true,
  restartLimit: 3,
  customCommands: [] // 未実装
}

module.exports = {
  smtpConfig,
  mailOptions,
  monitorConfig
}
