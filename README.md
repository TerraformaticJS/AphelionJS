# **☄️ AphelionJS**  
**Orchestrate infrastructure at the edge of the universe.**

AphelionJS is a JavaScript-powered infrastructure synthesis tool that generates clean, readable **Terraform HCL** from native JavaScript/TypeScript code.  

It’s designed for developers who love the power of Terraform but want the expressiveness of JavaScript to build scalable, modular, and dynamic infrastructure configs.

---

<img src="https://github.com/TerraformaticJS/AphelionJS/blob/main/docs/pebbelhpglow.jpg?raw=true" alt="Logo" width="200" />

## **🌌 What Problem Does It Solve?**

Terraform’s configuration language (**HCL**) is great — until you need to:

- Reuse config across environments or projects  
- Write logic-heavy templates with conditions, loops, and variations  
- Avoid drowning in duplicated blocks and curly brace chaos  

**AphelionJS** gives you the full power of JavaScript (arrays, functions, modules, string interpolation, etc.) while still outputting 100% valid and portable Terraform HCL.

---

## **🚀 Why AphelionJS?**

- 💫 **Dynamic Config Generation** – Use native JS to generate reusable infra blocks  
- 🧠 **No New Language to Learn** – Just JavaScript objects with a simple schema  
- ⚙️ **Terraform-Compatible Output** – Works with existing providers and modules  
- 🔭 **Full Transparency** – You write code, but see every line of the generated HCL  

> Like CDKTF or Pulumi, but focused on generating pure Terraform HCL — not cloud API calls or complex abstractions.

---

## **✨ Example: From JavaScript to HCL**

```javascript
const cometCore = {
  block: ["resource", "aws_s3_bucket", "comet_core"],
  attr: { bucket: `${sector}-asteroid-belt` },
  child: [{
    block: ["trajectory"],
    attr: { target_orbit: { $raw: "aws_s3_logs.galaxy.id" } }
  }]
};
```

Outputs this HCL:

```hcl
resource "aws_s3_bucket" "comet_core" {
  bucket = "alpha_centauri-asteroid-belt"
  trajectory {
    target_orbit = aws_s3_logs.galaxy.id
  }
}
```

---

## **🔧 Key Features**

- 🪐 **Zero New Syntax**: Just JS objects using `block`, `attr`, and `child`  
- 📦 **TypeScript Support**: Autocomplete + validation as you build  
- 🧪 **Pre-flight Validation**: Catch errors before `terraform apply`  
- 🔁 **Modular by Default**: Reuse logic with standard JS modules  
- 🧲 **Gradual Adoption**: Interop with existing `.tf` files and workflows

---

## **💡 Use Cases**

### 1. **Orbital Infrastructure Templates**  
Need dozens of resources with minor variations? Use array logic:

```js
const missions = ["explorer", "miner", "research"];
const probes = missions.map(name => ({
  block: ["resource", "aws_instance", name],
  attr: {
    ami: { $raw: "data.aws_ami.space_station.id" },
    instance_type: "t3.cosmic",
    tags: {
      Mission: name,
      Sector: { $var: "galaxy" }
    }
  }
}));
```

---

### 2. **Galaxy-Specific Networks**  
Avoid HCL duplication with parameterized infra blocks:

```js
export const createGalaxyNetwork = (sector) => ({
  block: ["module", "wormhole"],
  attr: {
    source: "terraform-aws-modules/wormhole/aws",
    cidr_block: sector === "alpha_centauri" ? "10.0.0.0/16" : "192.168.0.0/24",
    enable_nebula_gateway: sector === "alpha_centauri"
  }
});
```

---

### 3. **Reusable Security Blueprints**

```js
export const baseDefenseShield = {
  block: ["resource", "aws_security_group", "shield"],
  attr: {
    vpc_id: { $var: "wormhole_id" },
    ingress: {
      $func: `[for port in var.defense_ports : {
        from_port = port
        to_port   = port
        protocol  = "tcp"
      }]`
    }
  }
};
```

---

## **🔭 AphelionJS vs CDKTF vs Pulumi**

|                        | **AphelionJS**       | **CDKTF**               | **Pulumi**              |
|------------------------|----------------------|--------------------------|--------------------------|
| **Output**             | Pure HCL             | Generated HCL            | Cloud API calls          |
| **Language**           | JavaScript/TypeScript| TypeScript/Go/Python     | TypeScript/Go/Python     |
| **State Engine**       | Terraform            | Terraform                | Pulumi Engine            |
| **Abstractions**       | Lightweight (JS only)| CDK Constructs            | SDK-based APIs           |
| **Adoption Path**      | Incremental           | Requires full commit     | Full replacement         |

---

## **⚡ Quick Start**

### 1. Install  
```bash
npm install aphelion
```

### 2. Create Your Config  
```javascript
// infra.tfmatic.js
export default {
  block: ["terraform"],
  attr: {},
  child: [{
    block: ["required_providers"],
    attr: {
      aws: { source: "hashicorp/aws", version: "5.0.0" }
    }
  }]
};
```

### 3. Compile to HCL  
```bash
npx aphelion compile infra.tfmatic.js -o main.tf
```

### 4. Deploy with Terraform  
```bash
terraform init && terraform apply
```

---

## **🪐 Join the Cosmic Fleet**  
**AphelionJS** is for teams who:  
- 🌠 **JavaScript/TypeScript** ecosystems fuel their engines  
- 🛰️ Want gradual Terraform adoption across galaxies  
- 🌪️ Need dynamic config generation at warp speed  
- 🔭 Require full HCL transparency through the telescope  

```bash
git clone https://github.com/Aphelionjs/core
```

Open issues, submit PRs, and help chart our course. 🚀

---

## **⚠️ Legal Disclaimer**  
**AphelionJS** is an independent project and **not affiliated with or endorsed by HashiCorp or Terraform**.  
“Terraform” is a registered trademark of **HashiCorp, Inc.**
