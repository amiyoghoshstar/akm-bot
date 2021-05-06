var gali1 = require('./gali');


id = id.toLowerCase();
id = id.split('_').join(' ');
const exists = !!id.split(' ').find(str => gali.includes(str))
if (exists)
    res.json("true");
else {
    res.json("false");
}

