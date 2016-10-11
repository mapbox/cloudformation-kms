cloudformation-kms
------------------
Creates a KMS key, KMS alias, and CloudFormation export that can be used as a stable resource for encrypting and decrypting sensitive CloudFormation parameters.

### Why?

Certain CloudFormation resources (e.g. ECS environment variables) can leak secrets via API calls and CloudTrail logs. Using a KMS key to encrypt these values ensures they are protected and only the resources you grant access to decrypt using this key can access the plaintext values.

### Usage

Clone this repo and create a new CloudFormation stack per region using [cfn-config](https://github.com/mapbox/cfn-config):

```sh
cfn-config create production cloudformation/cloudformation-kms.template.js
```

If you have an existing legacy `cloudformation` KMS key enter its ARN to simply wrap the existing resource and export it to CloudFormation.

### Related usage

Ways to use this key:

- [cfn-config](https://github.com/mapbox/cfn-config) which can make use of a key aliased to `cloudformation` automatically for encrypting and decrypting CloudFormation parameters seamlessly.
- [decrypt-kms-env](https://github.com/mapbox/decrypt-kms-env) which makes it easy to decrypt these parameters into environment variables in an ECS/Dockerfile context.
- In a CloudFormation template using `{"Fn::ImportValue":"cloudformation-kms-production"}`

