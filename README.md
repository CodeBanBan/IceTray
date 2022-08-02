## IceTray
IceTray is simple tool to transform raw data to schema, and sanitize data type

### Getting Started

#### Installation
```
$ npm i icetray
```

#### Example
```js
const IceTray = require('icetray');

// Create Data Schema
const CatSchema = {
  id: Number,
  name: String,
  age: Number
}

const rawData = {
  id: '12345',
  name: 'Garfield',
  age: '3',
  color: 'black'
}

const cat = IceTray(CatSchema, rawData)
/* 
  cat = {
    id: 12345,
    name: 'Garfield,
    age: 3
  }
*/
```

#### Simple Schema Design
##### Type Support
- String `return data type String`
- Number `return data type Number`
- Boolean `return data type Boolean`
- 'default' `return raw data of key` 
```js
const schema = {
  key1: String,
  key2: {
    type: String,
    default: 'Default Value',
    fields: ['map1', 'map2', 'map3']
  }
}
```

#### Nested Schema Design
```js
const nestedSchema = {
  // Array of value
  key1: [String],
  
  // Array of Object
  key2: [{
    subKey1: String,
    subKey2: Number,
    subKey3: {
      type: String,
      fields: ['sk3', 'key3'],
      default: 'default-value'
    }
  }],
  
  // Object
  key3: {
    subKey1: String,
    subKey2: Number
  }
}
```

#### JSON Data Type
##### ==> Mode: Stringify
```js
const IceTray = require('icetray');
const {JSON_MODE, Type} = IceTray

// Create Data Schema
const CatSchema = {
  jsonData: Type.JSON,
  dataList: Type.JSON
}

const rawData = {
  jsonData: {
    id: 1,
    name: 'Garfield'
  },
  dataList: [1, 2, 3, 4, 5]
}

const cat = IceTray(CatSchema, rawData, JSON_MODE.STRINGIFY)
/* 
  cat = {
    jsonData: '{"id":1,"name":"Garfield}',
    dataList: '[1,2,3,4,5]'
  }
*/
```

##### ==> Mode: Parse
```js
const IceTray = require('icetray');
const {JSON_MODE, Type} = IceTray

// Create Data Schema
const CatSchema = {
  jsonData: Type.JSON,
  dataList: Type.JSON
}

const rawData = {
  jsonData: '{"id":1,"name":"Garfield"}',
  dataList: '[1,2,3,4,5]'
}

const cat = IceTray(CatSchema, rawData, JSON_MODE.PARSE)
/* 
  cat = {
    jsonData: {
      id: 1,
      name: "Garfield"
    }',
    dataList: [1, 2, 3, 4, 5]
  }
*/
```
