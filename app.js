const people = require("./people.js");
const work = require("./work.js");

async function main(){
    try{
        const peopledata = await people.getPeople();
        console.log (peopledata);
    }catch(e){
        console.log (e);
    }
}

//call main
main();