var request = require("superagent");
const Database = require("@replit/database");
const readline = require('readline');
const fs = require("fs");
const data = JSON.parse(fs.readFileSync("./src/attendance.json"));

const file = readline.createInterface({
  input: fs.createReadStream('./src/name copy.txt'),
  output: process.stdout,
  terminal: false
});
// https://docs.google.com/forms/d/e/<form-id>/viewform
// https://docs.google.com/forms/d/e/1FAIpQLSdno56YqccJqklR7Wek3eqLs6dt6lB2jti3r_8to8UB4WAPZg/viewform
////////////functions/////////////////

function phone() {
  var ccc = Math.floor(Math.random() * 4 + 6).toString();
  for (i = 0; i < 9; i++) {
    ccc += Math.floor(Math.random() * 9 + 0).toString();
  }
  return ccc;
}

function age() {
  var ccc = Math.floor(Math.random() * 20 + 18).toString();

  return ccc;
}

function branch() {
  var branchlist = [
    "Production Department",
    "Metallurgical Engineering",
    "Mechanical Engineering",
    "Mining department",
    "Electriacal Engieering",
    "IT department",
    "Computer science",
    "Chemical Engineering",
  ];
  return branchlist[Math.floor(Math.random() * 8 + 0)];
}

function Club() {
  var Club = [
    "Photography club",
    "Model club",
    "ISTE",
    "GRS",
    "IELTE",
    "Literary society",
    "hncc",
    "sports club",
    "SAE",
    "Leo club",
    "Eco club",
    "Rotract club",
    "Arts club",
  ];

  return Club[Math.floor(Math.random() * 8 + 0)];
}

function hobby() {
  var Club = [
    "Coding",
    "Hacking",
    "Photoshop",
    "Acting",
    "Singing",
    "Dancing",
    "Writing",
    "sports"
    
  ];

  return Club[Math.floor(Math.random() * 8 + 0)];
}
//////////////////////////////////////////
var formId = "1FAIpQLSfmn_3cU2x1E9YE8TfAPlZJUsoHUcnByxH2iKRaK8opzYOofQ";
var bitattendanceformid = " gib_input";

var seniorspam = {
  Name: "entry.2013461001",
  Branch: "entry.1849709507",
  Skill: "entry.970355258",
  Achievements: "entry.1445466410",
  Club: "entry.1309916992",
};



////////// adithya pai form///////////
paiatndncformid="1FAIpQLSdAXAh0PKw9dywJMRjaJKLuxJO3RRUphqq7ST5Z5KtIfvh0Jw"
var paiatndnc = {
  Email : "emailAddress",
  USN : "entry.465512450",
  NAME : "entry.1111672702",
  SECTION : "entry.2083881246",
  TOPIC : "entry.471191823",
  problemssolved :"entry.393446380",
  GuideName: "entry.1286224267"
};
////////// adithya pai form///////////





/////////////adityakmandal///////////////////

adityaformid="1FAIpQLSdxU9ByBbELXlexshaF-oFjy6zgu0kEcWX8hFUxX7m2lHanjg"
var adityaform = {
  NAME : "entry.662527696",
  BRANCH : "entry.1885982264",
  DATE : "entry.1701900561",
  Roll :"entry.133111286"
};
/////////////adityakmandal///////////////////






fields=paiatndnc

file.on('line', (line) => {
  console.log(c);
  c++


request
  .post(`https://docs.google.com/forms/d/e/${formId}/formResponse`)
  .type("form")
  .send({
    [fields.Name]: line,
    [fields.Branch]: branch(),
    [fields.Skill]: Skill(),
    [fields.Achievements]: 'none',
    [fields.Club]: Club()
  })
  .end(function (err, res) {
    if (err || !res.ok) {
     // console.error(err);
    } else {
     // console.log(res.body);
    }
  });

});
