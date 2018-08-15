var ref = require('@mapbox/cloudfriend').ref;
var cif = require('@mapbox/cloudfriend').if;
var join = require('@mapbox/cloudfriend').join;
var equals = require('@mapbox/cloudfriend').equals;
var getAtt = require('@mapbox/cloudfriend').getAtt;

module.exports = {
  AWSTemplateFormatVersion: '2010-09-09',
  Parameters: {
    LegacyKeyArn: {
      Type: 'String',
      Description: 'Optional. Use a legacy KMS key instead of a key managed by this stack',
      Default: ''
    }
  },
  Resources: {
    Key: {
      Condition: 'CreateKey',
      Type : 'AWS::KMS::Key',
      Properties : {
        Description: 'For encrypting Cloudformation Parameters',
        Enabled: true,
        EnableKeyRotation: false,
        KeyPolicy: {
          Version: '2012-10-17',
          Id: 'cloudformation-kms',
          Statement: [{
            Effect: 'Allow',
            Principal: {
              AWS: join(['arn:aws:iam::', ref('AWS::AccountId'), ':root']),
            },
            Action: ['kms:*'],
            Resource: '*'
          }]
        }
      }
    },
    Alias: {
      Condition: 'CreateKey',
      Type : 'AWS::KMS::Alias',
      Properties : {
        AliasName: 'alias/cloudformation',
        TargetKeyId: ref('Key')
      }
    }
  },
  Outputs: {
    Key: {
      Value: cif('CreateKey', getAtt('Key', 'Arn'), ref('LegacyKeyArn')),
      Export: {
        Name: ref('AWS::StackName')
      }
    }
  },
  Conditions: {
    CreateKey: equals(ref('LegacyKeyArn'), '')
  }
};
