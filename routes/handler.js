const axios = require('axios');

axios.get('http://localhost:3000/data/api.json?').then(function (res) {

    res.data instanceof Object;
   
    console.log(res.data);
}).catch(function (error) {

    console.log(error);
});