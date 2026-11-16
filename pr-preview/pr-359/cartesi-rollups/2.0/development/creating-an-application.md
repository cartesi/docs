> For the complete documentation index, see [llms.txt](https://docs.cartesi.io/llms.txt)

---
id: creating-an-application
title: Creating an Application
resources:
  - url: https://cartesiscan.io/
    title: CartesiScan
---



Cartesi CLI simplifies creating applications on Cartesi. To create a new application, run:

```shell
cartesi create <application-name> --template <language>
```

For example, create a JavaScript project.

```shell
cartesi create new-app --template javascript
```

This command creates a `new-app` directory with essential files for your application development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your application.

- `src/index.js`: A JavaScript file with template backend code that serves as your application's entry point.

- `package.json`: A list of dependencies required for your application along with the name, version and description of your application.

- `pnpm-lock.yaml` and `pnpm-workspace.yaml`: The [pnpm](https://pnpm.io) lockfile and settings. The template manages its packages with pnpm, in the version pinned by the `packageManager` field of `package.json`, through [corepack](https://nodejs.org/api/corepack.html): run `corepack enable pnpm` once if the `pnpm` command is not available.

- `rolldown.config.js`: The [rolldown](https://rolldown.rs) configuration that bundles `src/index.js` into `dist/index.mjs`, the file the Cartesi Machine runs.

The TypeScript template has the same layout, with `src/index.ts`, `rolldown.config.ts` and a `tsconfig.json`.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `java`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

:::note Libraries for simplifying development
We have high-level framework and alternative templates that simplify development and enhances input management, providing a smoother and more efficient experience.
For Go use Rollmelette, for Rust use Crabrolls, for Python use python-Cartesi and for TypeScript/JavaScript use Deroll.
Visit this [page](../resources/community-tools.md) to learn more about these and other available tools.
:::

## Implementing your application Logic

After creating your application, you can begin building your application by adding your logic to the index.js file. This file serves as the entry point of your application. While your project can include multiple files and directories, the default application file should remain the entry point of your application.

It’s important not to modify or remove existing code in index.js unless you fully understand its purpose, as doing so may prevent your application from functioning correctly. Instead, you are encouraged to extend the file by adding your own logic and implementations alongside the default code.

The default application templates include two primary handlers, one for each type of request. In most templates, they are the `handle_advance` and `handle_inspect` functions. In the JavaScript and TypeScript templates, they are the `advance` and `inspect` handlers passed to `rollup.run()` from the [`@cartesi/rollup`](https://www.npmjs.com/package/@cartesi/rollup) package, which talks directly to the Cartesi Machine instead of going through the rollup HTTP server: each handler receives the request, with its `payload` as a Node.js `Buffer`, and emits outputs with `rollup.emitNotice()`, `rollup.emitVoucher()` and `rollup.emitReport()`.

### handle_advance function

The `handle_advance` function (the `advance` handler in JavaScript and TypeScript) is the entry point for state modifying logic, you can think of this like handling "write" requests in traditional web context. It is intended to carry out computations, updates, and other logic that changes the state of the application. Where appropriate, it can emit outputs such as `notices`, `vouchers`, or `reports`. In JavaScript and TypeScript, the handler accepts the input unless it returns `false`.

### handle_inspect function

On the other hand, the `handle_inspect` function (the `inspect` handler in JavaScript and TypeScript) serves as the entry point for read only operations, similar to "read" requests in a typical web context. This function should be implemented to accept user input, perform any necessary lookups or calculations based on the current state, and return the results by emitting a `report`. It's important to understand that handle_inspect is designed strictly for reading the application's state, it should not perform any modifications.

### Adding dependencies in JavaScript and TypeScript

`cartesi build` installs the packages listed under `dependencies` in `package.json` inside an emulated RISC-V container, where pnpm can crash with a segmentation fault while it installs a large package such as `viem`. Add pure JavaScript packages as development dependencies instead, pinned to an exact version, and let rolldown bundle them into your application:

```shell
pnpm add -D viem@2.57.19
```

Then, in `rolldown.config.js` (`rolldown.config.ts` in the TypeScript template), leave only the native addon out of the bundle:

```javascript
  external: ["@cartesi/rollup"],
```

`@cartesi/rollup` is a native addon: it stays under `dependencies`, and the build installs its prebuilt RISC-V binary in the machine. The template's lockfile pins it to `1.0.0-alpha.3`; if you add it to a project yourself, pin that version too (`pnpm add @cartesi/rollup@1.0.0-alpha.3`), because its `latest` npm tag points to an older `0.0.0` release. A package that ships a native addon of its own cannot be bundled either: keep it under `dependencies` and add it to `external`.

## Implementing Outputs

If your application needs to emit Outputs like; notices, vouchers, or reports, make sure to implement the corresponding logic within your codebase to properly handle these outputs. You can check out the respective pages for [Notice](../api-reference/backend/notices.md), [Vouchers](../api-reference/backend/vouchers.md) or [Report](../api-reference/backend/reports.md) for better understanding of what they are and how to implement them.

Below is a sample application that has been modified to include the logic to simply receive an input from a user in both inspect and advance route then, emits a notice, voucher and a report. For your application you'll need to include your personal logic and also emit outputs when necessary. The JavaScript version encodes the voucher with `viem`, so add it as described in [Adding dependencies in JavaScript and TypeScript](#adding-dependencies-in-javascript-and-typescript):


import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import ImplementingOutputsJS from './snippets/implementing_outputs_js.md';
import ImplementingOutputsPY from './snippets/implementing_outputs_py.md';
import ImplementingOutputsRS from './snippets/implementing_outputs_rs.md';
import ImplementingOutputsGO from './snippets/implementing_outputs_go.md';
import ImplementingOutputsCPP from './snippets/implementing_outputs_cpp.md';


<Tabs>
  <TabItem value="JavaScript" label="JavaScript" default>
<pre><code>

<ImplementingOutputsJS />

</code></pre>
</TabItem>

<TabItem value="Python" label="Python" default>
<pre><code>

<ImplementingOutputsPY />

</code></pre>
</TabItem>

<TabItem value="Rust" label="Rust" default>
<pre><code>

<ImplementingOutputsRS />

</code></pre>
</TabItem>

<TabItem value="Go" label="Go" default>
<pre><code>

<ImplementingOutputsGO />

</code></pre>
</TabItem>

<TabItem value="C++" label="C++" default>
<pre><code>

<ImplementingOutputsCPP />

</code></pre>
</TabItem>

</Tabs>