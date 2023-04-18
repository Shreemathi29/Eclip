/*
 *   Copyright (c) 2021 vlinder Labs Private Limited
 *   All rights reserved.
 *   This software is proprietary of Vlinder Labs Pvt. Ltd and can not be distributed / used for any purpose outside of Vlinder Labs Pvt. Ltd without explicit written consent from the copyright owner.
 */
// @ts-ignore
// import chalk from 'chalk';
const chalk = require('chalk');
export const chalkErr = chalk.bold.red;
// export const chalkWarn = chalk.Color
export const chalkInfo = chalk.whiteBright;
export const chalkImp = chalk.underline.bold.blueBright;
export const chalkTrivial = chalk.bgCyan;
export const chalkReportKey = chalk.green;
export const chalkReportValue = chalk.underline.greenBright;
export const chalkModuleKey = chalk.cyan;
export const chalkModuleValue = chalk.underline.cyanBright;
