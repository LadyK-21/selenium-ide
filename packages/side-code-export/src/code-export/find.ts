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

import { CommandShape, TestShape } from '@seleniumhq/side-model'

export function deduplicateReusedTestMethods(testMethods: TestShape[]) {
  return testMethods.filter((entry, index) => {
    const firstEntryIndex = testMethods.findIndex(
      (entry2) => entry2.name === entry.name
    )
    const isFirstEntry = firstEntryIndex === index
    return isFirstEntry
  })
}

export function findCommandThatOpensWindow(
  test: TestShape,
  tests: TestShape[],
  searchedTests: TestShape[] = []
): CommandShape | null {
  searchedTests.push(test)
  for (const command of test.commands) {
    if (command.opensWindow) {
      return command
    }
    if (command.command === 'run') {
      const nestedTests = findReusedTestMethods(test, tests)
      for (const nestedTest in nestedTests) {
        if (searchedTests.indexOf(nestedTests[nestedTest]) !== -1) {
          continue
        }
        const cmd = findCommandThatOpensWindow(
          nestedTests[nestedTest],
          tests,
          searchedTests
        )
        if (cmd) {
          return cmd
        }
      }
    }
  }
  return null
}

export function findReusedTestMethods(
  test: TestShape,
  tests: TestShape[],
  results: TestShape[] = []
) {
  for (const command of test.commands) {
    if (command.command === 'run') {
      const reusedTest = tests.find((test) => test.name === command.target)
      const newTests = tests.filter((test) => results.indexOf(test) === -1)
      if (reusedTest && results.indexOf(reusedTest) === -1) {
        results.push(reusedTest)
        findReusedTestMethods(reusedTest, newTests, results)
      } else {
        console.log(
          'Encountered a dynamic test declaration, including all tests as methods - will bloat code'
        )
        results.push(...newTests)
      }
    }
  }
  return results
}
