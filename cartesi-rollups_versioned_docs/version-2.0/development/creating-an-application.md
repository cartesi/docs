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

For example, create a Javascript project.

```shell
cartesi create new-app --template javascript
```

This command creates a `new-app` directory with essential files for your application development.

- `Dockerfile`: Contains configurations to build a complete Cartesi machine with your app's dependencies. Your backend code will run in this environment.

- `README.md`: A markdown file with basic information and instructions about your application.

- `src/index.js`: A javascript file with template backend code that serves as your application's entry point.

- `package.json`: A list of dependencies required for your application along with the name, version and description of your application.

Cartesi CLI has templates for the following languages – `cpp`, `cpp-low-level`, `go`, `java`, `javascript`, `lua`, `python`, `ruby`, `rust`, and `typescript`.

:::note Libraries for simplifying development
We have high-level framework and alternative templates that simplify development and enhances input management, providing a smoother and more efficient experience.
For Go use Rollmelette, for Rust use Crabrolls, for Python use python-Cartesi and for Typescript/Javascrips use Deroll.
Visit this [page](../resources/community-tools.md) to learn more about these and other available tools.
:::

## Implementing your application Logic

After creating your application, you can begin building your application by adding your logic to the index.js file. This file serves as the entry point of your application. While your project can include multiple files and directories, the default application file should remain the entry point of your application.

It’s important not to modify or remove existing code in index.js unless you fully understand its purpose, as doing so may prevent your application from functioning correctly. Instead, you are encouraged to extend the file by adding your own logic and implementations alongside the default code.

The default application template includes two primary functions; `handle_advance` and `handle_inspect`. These act as entry points for different types of operations within your application.

### handle_advance function

The `handle_advance` function is the entry point for state modifying logic, you can think of this like handling "write" requests in traditional web context. It is intended to carry out computations, updates, and other logic that changes the state of the application. Where appropriate, it can emit outputs such as `notices`, `vouchers`, or `reports`.

### handle_inspect function

On the other hand, the `handle_inspect` function serves as the entry point for read only operations, similar to "read" requests in a typical web context. This function should be implemented to accept user input, perform any necessary lookups or calculations based on the current state, and return the results by emitting a `report`. It's important to understand that handle_inspect is designed strictly for reading the application's state, it should not perform any modifications.

## Implementing Outputs

If your application needs to emit Outputs like; notices, vouchers, or reports, make sure to implement the corresponding logic within your codebase to properly handle these outputs. You can check out the respective pages for [Notice](../api-reference/backend/notices.md), [Vouchers](../api-reference/backend/vouchers.md) or [Report](../api-reference/backend/reports.md) for better understanding of what they are and how to implement them.

Below is a sample application that has been modified to include the logic to simply receive an input from a user in both inspect and advance route then, emits a notice, voucher and a report. For your application you'll need to include your personal logic and also emit outputs when necessary:


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