## Getting Started

####Installation
```
$ npm i icetray
```

####Example
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

####Simple Schema Design
##### Type Support
- String `return data type String`
- Number `return data type Number`
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
