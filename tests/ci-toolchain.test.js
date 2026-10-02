import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const workflow=readFileSync(process.argv[2]??new URL('../.github/workflows/ci.yml',import.meta.url),'utf8');
const setup=workflow.search(/uses:\s*jdx\/mise-action@/);
assert.ok(setup>=0 && setup<workflow.indexOf('- name: Verify'),'CI must install mise before executing configured guard hooks');
console.log('ci-toolchain: configured hook runtime installed before verification');
