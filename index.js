/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */

module.exports = require('./dist/index');

if (require.main === module) {
  // Run the application

  process.on('uncaughtException', err => {
    console.log('uncaughtException ==>', err);
    process.exit(1);
  });

  process.on('unhandledRejection', err => {
    console.log('unhandledRejection ==>', err);
    process.exit(2);
  });

  const {VApplication} = require('./dist/application');

  const app = new VApplication();
  app
    .start()
    .then(() => {
      console.log(`======> ⚡️🚀 Application started ⚡️🚀 <=======`);
    })
    .catch(err => {
      console.error('Cannot start the application.', err);
      process.exit(1);
    });
}
