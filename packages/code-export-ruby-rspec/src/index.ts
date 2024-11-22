// Licensed to the Software Freedom Conservancy (SFC) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The SFC licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

import {
  codeExport as exporter,
  generateHooks,
  LanguageEmitterOpts,
  languageFromOpts,
} from 'side-code-export'
import emitter from './command'
import location from './location'
import hooks from './hook'

// Define language options
export const displayName = 'Ruby RSpec'

export const opts: LanguageEmitterOpts = {
  emitter: emitter,
  displayName,
  name: 'ruby-rspec',
  hooks: generateHooks(hooks),
  fileExtension: '_spec.rb',
  commandPrefixPadding: '  ',
  terminatingKeyword: 'end',
  commentPrefix: '#',
  // Create generators for dynamic string creation of primary entities (e.g., filename, methods, test, and suite)
  generateTestDeclaration: function generateTestDeclaration(name) {
    return `it '${exporter.parsers.uncapitalize(
      exporter.parsers.sanitizeName(name)
    )}' do`
  },
  generateMethodDeclaration: function generateMethodDeclaration(name) {
    return `def ${exporter.parsers.uncapitalize(
      exporter.parsers.sanitizeName(name)
    )}`
  },
  generateSuiteDeclaration: function generateSuiteDeclaration(name) {
    return `describe '${exporter.parsers.capitalize(
      exporter.parsers.sanitizeName(name)
    )}' do`
  },
  generateFilename: function generateFilename(name) {
    return `${exporter.parsers.uncapitalize(
      exporter.parsers.sanitizeName(name)
    )}${opts.fileExtension}`
  },
}

export default languageFromOpts(opts, location.emit);