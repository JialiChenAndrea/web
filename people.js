const axios = require('axios');
function isVowel(x) {
    if (x.toLowerCase() == 'a' || x.toLowerCase() == 'e' || x.toLowerCase() == 'i' || x.toLowerCase() == 'o' || x.toLowerCase() == 'u') {
        return true
    }
    return false
}
async function getPersonById(id) {
    if (id === undefined) {
        throw "The id doesn's exist,please input an id"
    }
    else if (Number.isInteger(id) === false) {
        throw "The id is not an integer"
    }
    else if (id < 1 || id > 1000) {
        throw 'The id is out of bounds'
    }
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')
    const parsedData = JSON.parse(JSON.stringify(data))
    for (i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id == id) {
            return parsedData[i]
        }
    }
    throw "The id doesn's exist"
}


async function getNameById(id) {
    if (id === undefined) {
        throw "The id doesn's exist,please input an id"
    }
    else if (Number.isInteger(id) === false) {
        throw "The id is not an integer"
    }
    else if (id < 1 || id > 1000) {
        throw 'The id is out of bounds'
    }
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')
    const parsedData = JSON.parse(JSON.stringify(data))
    for (i = 0; i < parsedData.length; i++) {
        if (parsedData[i].id == id) {
            return { "first_name": parsedData[i].first_name, "last_name": parsedData[i].last_name }
        }
    }
    throw "The id doesn's exist"
}

async function howManyPerState(stateAbbrv) {
    if (stateAbbrv === undefined) {
        throw "The stateAbbrv doesn't exist,please input a stateAbbrv"
    }
    else if (typeof stateAbbrv != "string") {
        throw "The stateAbbrv is not string,please input a string stateAbbrv"
    }

    else {
        const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')
        const parsedData = JSON.parse(JSON.stringify(data))
        let count = 0
        for (i = 0; i < parsedData.length; i++) {
            if (parsedData[i].address.state == stateAbbrv) {
                count++
            }
        }
        if (count == 0) {
            throw "There are no people that live in the " + stateAbbrv
        }
        else {
            return count
        }
    }
}
function compareAge(a, b) {
    let datea = a.date_of_birth.split('/');
    let dateb = b.date_of_birth.split('/');
    let date1 = new Date(datea[2], datea[0] - 1, datea[1]);
    let date2 = new Date(dateb[2], dateb[0] - 1, dateb[1]);
    if (date1 < date2) {
        return -1
    } else {
        return 1
    }
}
function calAge(date_of_birth) {
    let d = date_of_birth.split('/');
    let birthdate = new Date(d[2], d[0] - 1, d[1]);
    let diff_ms = Date.now() - birthdate.getTime();
    let age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970)
}

async function personByAge(index) {
    if (index === undefined) {
        throw "The index doesn't exist,please input an index"
    }
    else if (Number.isInteger(index) == false) {
        throw "The index is not integer,please input an integer index"
    }
    else if (index < 0 || index > 999) {
        throw 'The index is out of bounds'
    }
    else {
        const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')
        const parsedData = JSON.parse(JSON.stringify(data))
        parsedData.sort(compareAge);
        result = { first_name: parsedData[index].first_name, last_name: parsedData[index].last_name, date_of_birth: parsedData[index].date_of_birth, age: calAge(parsedData[index].date_of_birth) }


        return result

    }
}

async function peopleMetrics() {
    const { data } = await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')
    const parsedData = JSON.parse(JSON.stringify(data))

    let totalLetters = 0;
    let totalVowels = 0;
    let totalConsonants = 0;
    let longestName = "";
    let shortestName = "";
    let mostRepeatingCity = "";
    let averageAge = 0;
    let city = {}
    parsedData.forEach(obj => {

        totalLetters += obj.first_name.length + obj.last_name.length;
        for (let letter of obj.first_name) {
            if (isVowel(letter) === true) {
                totalVowels += 1;
            }
            else {
                totalConsonants += 1;
            }
        }
        for (let letter of obj.last_name) {
            if (isVowel(letter) === true) {
                totalVowels += 1;
            }
            else {
                totalConsonants += 1;
            }
        }

        if (shortestName === "") {
            shortestName = obj.first_name + " " + obj.last_name;
        }
        else {
            if (obj.first_name.length + obj.last_name.length < shortestName.length) {
                shortestName = obj.first_name + " " + obj.last_name;
            }

            if (obj.first_name.length + obj.last_name.length > longestName.length) {
                longestName = obj.first_name + " " + obj.last_name;
            }
        }
        city[obj.address.state] = city[obj.address.state] ? city[obj.address.state] + 1 : 1
        averageAge += calAge(obj.date_of_birth)
    });
    mostRepeatingCity = Object.keys(city).reduce(function (a, b) { return city[a] > city[b] ? a : b });
    averageAge = (averageAge / parsedData.length).toFixed()
    let result = { 'totalLetters': totalLetters, 'totalVowels': totalVowels, 'totalConsonants': totalConsonants, 'longestName': longestName, 'shortestName': shortestName, 'mostRepeatingCity': mostRepeatingCity, 'averageAge': averageAge };
    return result;
}


module.exports = {
    getPersonById,
    howManyPerState,
    personByAge,
    compareAge,
    peopleMetrics,
    calAge,
    isVowel,
    getNameById,
};