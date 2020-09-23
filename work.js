const axios = require('axios');
async function listEmployees() {
    const workData = (await axios.get('https://gist.githubusercontent.com/graffixnyc/febcdd2ca91ddc685c163158ee126b4f/raw/c9494f59261f655a24019d3b94dab4db9346da6e/work.json')).data;
    const parsedWork = JSON.parse(JSON.stringify(workData))
    let list = []

    parsedWork.forEach(element => {
        company = { "company_name": element.company_name, "employees": element.employees }
        list.push(company)
    });
    const peopleData = (await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')).data;
    names = []
    list.forEach(element => {
        names = []
        element.employees.forEach(id => {
            name = { "first_name": "", "last_name": "" }
            for (let people of peopleData) {
                if (people.id == id) {
                    name.first_name = people.first_name
                    name.last_name = people.last_name
                    break;
                }
            }
            names.push(name)
        });
        element.employees = names
    });

    return list
}

function isValidPhoneNumber(phone) {
    let format = /^(\d{3}-)\d{3}-\d{4}$/;
    if (phone.match(format)) {
        return true;
    }
    else {
        return false;
    }
}
async function fourOneOne(phoneNumber) {
    if (phoneNumber === undefined) {
        throw "The phoneNumber doesn't exist,pleas input a phoneNumer"
    }
    else if (typeof phoneNumber != 'string') {
        throw "The phoneNumber is not a string,please input a string phoneNumber"
    }
    else if (isValidPhoneNumber(phoneNumber) == false) {
        throw "The phoneNumber is not ###-###-#### format"
    }
    else {
        const data = (await axios.get('https://gist.githubusercontent.com/graffixnyc/febcdd2ca91ddc685c163158ee126b4f/raw/c9494f59261f655a24019d3b94dab4db9346da6e/work.json')).data;
        const parsedWork = JSON.parse(JSON.stringify(data))
        for (i = 0; i < parsedWork.length; i++)
            if (parsedWork[i].company_phone == phoneNumber) {
                return { "company_name": parsedWork[i].company_name, "company_address": parsedWork[i].company_address }
            }
        throw "The company cannot be found for the supplied phone number"

    }

}
function isValidSsn(ssn) {
    let format = /^(\d{3}-)\d{2}-\d{4}$/;
    if (ssn.match(format)) {
        return true;
    }
    else {
        return false;
    }
}

async function whereDoTheyWork(ssn) {
    if (ssn === undefined) {
        throw "The ssn doesn't exist,pleas input an ssn"
    }
    else if (typeof ssn != 'string') {
        throw "The ssn is not a string,please input a string ssn"
    }
    else if (isValidSsn(ssn) == false) {
        throw "The ssn is not ###-##-#### format"
    }
    else {
        var firstName = ""
        var lastName = ""
        var company = ""
        var id = 0
        const peopleData = (await axios.get('https://gist.githubusercontent.com/graffixnyc/31e9ef8b7d7caa742f56dc5f5649a57f/raw/43356c676c2cdc81f81ca77b2b7f7c5105b53d7f/people.json')).data

        for (let people of peopleData) {
            if (people.ssn == ssn) {
                id = people.id;
                firstName = people.first_name;
                lastName = people.last_name;
                break;
            }
        }
        if (id == 0) {
            throw "No one exists with that SSN"
        }
        const workData = (await axios.get('https://gist.githubusercontent.com/graffixnyc/febcdd2ca91ddc685c163158ee126b4f/raw/c9494f59261f655a24019d3b94dab4db9346da6e/work.json')).data
        for (let work of workData) {
            if (work.employees.includes(id)) {
                company = work.company_name
                break;
            }
        }
        if (company == "") {
            throw "This person doesn't work for any company on the list"
        }
        return firstName + " " + lastName + " works at " + company + "."
    }

}

module.exports = {
    listEmployees,
    fourOneOne,
    isValidPhoneNumber,
    whereDoTheyWork,
    isValidSsn
}
