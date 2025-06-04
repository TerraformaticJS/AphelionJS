# AphelionJS Use Cases & Real-World Examples

*Harness the power of JavaScript to make your Terraform infrastructure code more modular, dynamic, and maintainable.*

---

## Outline

1. [Use Case 1: Config File Modularity](#use-case-1-config-file-modularity)  
   1.1 [The Challenge of Monolithic Configs](#the-challenge-of-monolithic-configs)  
   1.2 [Building Reusable JS Modules](#building-reusable-js-modules)  
   1.3 [Example: Multi-Environment Infrastructure](#example-multi-environment-infrastructure)  
       1.3.1 [VPC Network Module](#vpc-network-module)  
       1.3.2 [RDS Database Module](#rds-database-module)  
       1.3.3 [Combining Modules for Production](#combining-modules-for-production)  
   1.4 [Benefits](#benefits)  

2. [Use Case 2: Dynamic Config Generation](#use-case-2-dynamic-config-generation)  
   2.1 [The Challenge of Count/For_Each](#the-challenge-of-countfor_each)  
   2.2 [Generating Resources Dynamically](#generating-resources-dynamically)  
       2.2.1 [Example: S3 Buckets from a List](#example-s3-buckets-from-a-list)  
       2.2.2 [Using Loops, Filters, and Conditions](#using-loops-filters-and-conditions)  
       2.2.3 [Integrating External Data (APIs, DBs)](#integrating-external-data-apis-dbs)  
   2.3 [Benefits](#benefits-1)  

3. [Use Case 3: Environment-Specific Configs](#use-case-3-environment-specific-configs)  
   3.1 [The Challenge of Dev/Stage/Prod Duplication](#the-challenge-of-devstageprod-duplication)  
   3.2 [Generating Configs Per Environment](#generating-configs-per-environment)  
       3.2.1 [Example: EC2 Autoscaling Groups](#example-ec2-autoscaling-groups)  
       3.2.2 [Example: Different IAM Roles Per Environment](#example-different-iam-roles-per-environment)  
   3.3 [Benefits](#benefits-2)  

4. [Use Case 4: Real-World Integrations](#use-case-4-real-world-integrations)  
   4.1 [Using External Data Sources](#using-external-data-sources)  
       4.1.1 [Example: Importing Instance Types from AWS Pricing API](#example-importing-instance-types-from-aws-pricing-api)  
       4.1.2 [Example: Fetching Latest AMIs from AWS SDK](#example-fetching-latest-amis-from-aws-sdk)  
   4.2 [Benefits](#benefits-3)  

5. [Use Case 5: Programmatic Validation](#use-case-5-programmatic-validation)  
   5.1 [The Challenge of HCL’s Static Syntax](#the-challenge-of-hcls-static-syntax)  
   5.2 [Validating Infrastructure Definitions](#validating-infrastructure-definitions)  
       5.2.1 [Example: EC2 Instance Type Validation](#example-ec2-instance-type-validation)  
       5.2.2 [Example: Enforcing Tagging Standards](#example-enforcing-tagging-standards)  
       5.2.3 [Example: Preventing Hardcoded Secrets](#example-preventing-hardcoded-secrets)  
   5.3 [Benefits](#benefits-4)  

6. [Use Case 6: Cross-Cloud Deployments](#use-case-6-cross-cloud-deployments)  
   6.1 [The Challenge of Cloud-Specific Configs](#the-challenge-of-cloud-specific-configs)  
   6.2 [Building Cross-Cloud Modules](#building-cross-cloud-modules)  
       6.2.1 [Example: AWS and Azure Networking](#example-aws-and-azure-networking)  
       6.2.2 [Example: Kubernetes Cluster Definitions](#example-kubernetes-cluster-definitions)  
   6.3 [Benefits](#benefits-5)  

7. [AphelionJS vs. Other JavaScript Wrappers](#aphelionjs-vs-other-javascript-wrappers)  


## Use Case 1: Config File Modularity

### The Challenge of Monolithic Configs

Terraform configurations often become bulky and difficult to maintain when all resources are defined in large, monolithic files. This complexity can slow down development and cause errors.

### Building Reusable JS Modules

AphelionJS lets you encapsulate infrastructure components into reusable JavaScript modules that you can import and combine. This modular approach encourages code reuse and better organization.

### Example: Multi-Environment Infrastructure

#### VPC Network Module

```javascript
export const networkModule = (env) => ({
  block: ["module", "vpc"],
  attributes: {
    source: "terraform-aws-modules/vpc/aws",
    cidr_block: env === "prod" ? "10.0.0.0/16" : "192.168.0.0/24",
    azs: ["us-west-2a", "us-west-2b"],
  },
});
````

#### RDS Database Module

```javascript
export const databaseModule = ({ instanceClass }) => ({
  block: ["resource", "aws_db_instance", "default"],
  attributes: {
    engine: "postgres",
    instance_class: instanceClass,
  },
});
```

#### Combining Modules for Production

```javascript
import { networkModule } from "./network.js";
import { databaseModule } from "./database.js";

const config = {
  block: ["terraform"],
  child: [
    networkModule("prod"),
    databaseModule({ instanceClass: "db.t3.large" }),
  ],
};
```

### Benefits

* **Reusability Across Teams:** Share standardized modules for consistency and faster onboarding.
* **Environment Switching:** Use JS logic to tailor modules to different environments dynamically.
* **TypeScript Autocompletion:** Improve DX with typed modules and validation.

---

## Use Case 2: Dynamic Config Generation

### The Challenge of Count/For\_Each

Terraform’s native `count` and `for_each` sometimes lack the flexibility to handle complex dynamic generation logic.

### Generating Resources Dynamically

AphelionJS leverages full JavaScript capabilities such as loops, filters, and conditional logic for generating infrastructure code dynamically.

#### Example: S3 Buckets from a List

```javascript
const buckets = ["user-uploads", "logs", "backups"];

const dynamicBuckets = buckets.map((name) => ({
  block: ["resource", "aws_s3_bucket", name],
  attributes: {
    bucket: `${name}-${{ $var: "env" }}`,
    tags: {
      $func: `tomap({
        Name = "${name}",
        Env  = var.env
      })`,
    },
  },
  child: [
    {
      block: ["lifecycle"],
      attributes: {
        prevent_destroy: name !== "backups",
      },
    },
  ],
}));
```

#### Using Loops, Filters, and Conditions

You can apply complex filters or conditional logic to dynamically generate only the necessary resources, something cumbersome in pure HCL.

#### Integrating External Data (APIs, DBs)

Pull live data from APIs or databases to generate infrastructure—e.g., fetch a list of user accounts or external IPs and create resources accordingly.

### Benefits

* **JavaScript Arrays and Conditionals:** Leverage powerful and familiar JS constructs for infra generation.
* **Complex Logic Without HCL Complexity:** Avoid convoluted HCL dynamic blocks and interpolation hacks.

---

## Use Case 3: Environment-Specific Configs

### The Challenge of Dev/Stage/Prod Duplication

Maintaining separate TF files or variables for dev, staging, and production often leads to duplicated and error-prone configurations.

### Generating Configs Per Environment

Use JS to generate environment-specific configs dynamically, minimizing duplication.

#### Example: EC2 Autoscaling Groups

```javascript
const autoscalingConfig = (env) => ({
  block: ["resource", "aws_autoscaling_group", "app"],
  attributes: {
    desired_capacity: env === "prod" ? 5 : 1,
    max_size: env === "prod" ? 10 : 2,
  },
});
```

#### Example: Different IAM Roles Per Environment

```javascript
const iamRoleConfig = (env) => ({
  block: ["resource", "aws_iam_role", "app_role"],
  attributes: {
    name: env === "prod" ? "app-role-prod" : "app-role-dev",
    assume_role_policy: "...",
  },
});
```

### Benefits

* **Single Source of Truth:** One place to define environment differences.
* **Parameterize Everything:** Avoid scattered TFvars and inconsistent overrides.

---

## Use Case 4: Real-World Integrations

### Using External Data Sources

Leverage APIs or SDKs to bring live data into your Terraform configs, improving accuracy and relevance.

#### Example: Importing Instance Types from AWS Pricing API

Fetch current AWS instance prices and restrict configurations to cost-effective options.

#### Example: Fetching Latest AMIs from AWS SDK

Automatically query and use the latest Amazon Machine Images (AMIs) without manual updates.

### Benefits

* **Always Up-to-Date Infrastructure:** Reduce drift and manual errors.
* **Data-Driven Decisions:** Infrastructure shaped by real-world data and policies.

---

## Use Case 5: Programmatic Validation

### The Challenge of HCL’s Static Syntax

Terraform only reports many config errors during plan or apply phases, slowing feedback loops.

### Validating Infrastructure Definitions

Use JavaScript functions to validate config correctness before generating HCL.

#### Example: EC2 Instance Type Validation

```javascript
const validTypes = ["t3.micro", "t3.large"];

const validateInstanceType = (config) => {
  if (!validTypes.includes(config.attributes.instance_type)) {
    throw new Error(`Invalid instance type: ${config.attributes.instance_type}`);
  }
};

const ec2Config = {
  block: ["resource", "aws_instance", "web"],
  attributes: { instance_type: "t3.mega" },
};

validateInstanceType(ec2Config); // Throws early error
```

#### Example: Enforcing Tagging Standards

Ensure all resources include required tags like `Owner` or `Project`.

#### Example: Preventing Hardcoded Secrets

Reject configs that contain plain-text secrets instead of secure vault references.

### Benefits

* **Fail Fast, Fail Early:** Catch issues before running Terraform.
* **Custom Business Rules:** Enforce organizational policies programmatically.

---

## Use Case 6: Cross-Cloud Deployments

### The Challenge of Cloud-Specific Configs

Supporting multiple cloud providers usually means maintaining separate codebases or complex abstractions.

### Building Cross-Cloud Modules

Create modules abstracting provider differences, generating provider-specific configs from a single JS codebase.

#### Example: AWS and Azure Networking

Define a generic `networkModule` and output cloud-specific configs based on provider choice.

#### Example: Kubernetes Cluster Definitions

Generate clusters on AWS EKS or Azure AKS with shared logic, switching only provider-specific parameters.

### Benefits

* **One Codebase, Multiple Providers:** Easier maintenance and faster feature rollout.
* **Flexible Deployment Strategies:** Switch or extend clouds with minimal rewrites.

---

## AphelionJS vs. Other JavaScript Wrappers

| Feature        | AphelionJS                 | CDKTF                 | Pulumi           |
| -------------- | -------------------------- | --------------------- | ---------------- |
| Approach       | JS ➔ HCL (Direct)          | JS ➔ HCL (Abstracted) | JS ➔ Cloud APIs  |
| Learning Curve | Low                        | Moderate              | Steep            |
| HCL Control    | Full                       | Partial               | None             |
| Dynamic Logic  | Native JS                  | CDK Constructs        | Native JS/TS     |
| Ecosystem      | Lightweight                | AWS/Azure/GCP modules | Multi-Cloud SDKs |
| Best For       | Terraform fans who love JS | CDK enthusiasts       | Cloud SDK users  |

---

*AphelionJS brings the best of both worlds: direct Terraform control combined with JavaScript’s flexibility, making it ideal for teams who want to supercharge their infrastructure development.*

---
