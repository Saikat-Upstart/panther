/**
 * Panther is a scalable, powerful, cloud-native SIEM written in Golang/React.
 * Copyright (C) 2020 Panther Labs Inc
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
const { spawn } = require('child_process');
const { loadDotEnvVars, validateEnvVars } = require('./utils');

// Mark the Node environment as development in order to load the proper webpack configuration
process.env.NODE_ENV = 'development';

// Add all the aws-related ENV vars to process.env
loadDotEnvVars('../out/.env.aws');

// Validate that the minimum required vars have been set
validateEnvVars();

spawn('node_modules/.bin/webpack-dev-server', {
  stdio: 'inherit',
});
