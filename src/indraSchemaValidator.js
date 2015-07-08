var validate = require('jsonschema').validate

// schema:
// {
//   type: 'someString'
//   data: {...}
// }
var indraSchema = {
  "id": "/Post",
  "type": "object",
  "properties": {
    "type": {"type": "string"},
  },
  "required":["type"]
}

// returns true/false if schema is/isnot valid
function checkSchema (instance, schema) {
  if (validate(instance, schema).errors.length > 0) 
    return false
  return true
}

// returns true if valid to indra's schema
function isValid (instance) {
  return instance && checkSchema(instance, indraSchema)
}

module.exports = isValid


