# Contributing

Start by reading the README and reproducing the behavior you want to change. Keep changes focused and describe the user-visible result.

## Local validation

Run from the repository root:

```sh
node test.js
node companion-module/test/protocol.test.js
node companion-module/test/actions.test.js
```

Both `visca.js` and `companion-module/src/protocol.js` contain command builders. Review both when changing packet behavior, and add expected-byte fixtures plus invalid-input checks. Preserve dry-run defaults. Tests must not open sockets or require physical hardware. Document manual/firmware evidence for protocol changes; passing packet tests alone is not live-camera validation.

## Submitting changes

1. Create a branch for the change.
2. Add regression coverage for behavior changes and update relevant examples.
3. Run the checks above and `git diff --check`.
4. Open a pull request describing the problem, change, test results, and any remaining limitations.

For bug reports, include runtime versions, a minimal reproduction, expected and actual behavior, and sanitized output. Do not include tokens or credentials. Keep hardware-dependent observations separate from offline results.

## Companion packaging

The module declares Node `^22.20` and Yarn `4.17.0`. Packaging also requires the dependencies in `companion-module/package.json` and runs the `package` script from that directory. The repository currently has no dependency lockfile, so packaging is not reproducible and is not covered by the offline checks. Do not treat offline test success as proof that the module can be installed in Companion.
