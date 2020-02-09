const readline = require('readline');
const fs = require('fs');
const {Package} = require('./models/package');


//Takes file name (String) and separator(String)
// Returns mongoose Package model Objects
async function debianFileParser(file, separator) {
    const separatedPackages = await separatePackages(file, separator);
    const packagesWithFieldsParsed = await parsePackageFields(separatedPackages, separator);
    const readyPackages = await getReverseDependencies(packagesWithFieldsParsed);
    return readyPackages;
}

async function separatePackages(file, separator) {
    //Create linereader
    const linereader = readline.createInterface({
        input: fs.createReadStream(file),
        setEncoding: 'utf-8'
    });
    let allPackages = [];
    let latestPackage = '';
    const result =  await new Promise(resolve => { 
    linereader
    .on('line', function(line) {
        //Check if multiline value ex. description. Starts with a single space
        if(/^\s/.test(line)) latestPackage += line;
        /*
        Check if empty line  == end of package. 
        Push latest package to allPackages Array.
        Clear latestPackage variable.
        */
        else if (/^\s*$/.test(line)) {
            // In case of two empty lines. Sometimes in the end of the file.
            // No need to add package to allPackages.
            if(latestPackage !== '') allPackages.push(latestPackage);   
            latestPackage = '';
        }
        // Chek if latest Package is empty. Used when parsing a new package.
        else if(latestPackage === '') latestPackage += line;
        /*
        Key value pair parsed, add an separator for later use.
        Needed later when parsing individual Packages.
        */
        else latestPackage += `${separator}${line}`;
     })
     .on('close', function() { 
         //If file ends without an empty line, add the latestPackage to allPackages
        if(latestPackage !== '') allPackages.push(latestPackage);    
        resolve(allPackages);
     }); 
    });

    return result;
}


    //Parse individual fields from each package
async function parsePackageFields(packages, separator) {
    let fields;
    let allPackages = {};
    let currentPackage = {};
    let keyValuePair;
    
    // Loop over all packages.
    for(let i in packages) {
        //Separate all individual fields
        fields = packages[i].split(separator);
            
        //Loop over all Fields
        for(let j in fields) {
            //Separate key and value. 
            keyValuePair = fields[j].split(/:\s/);
            if(keyValuePair[0].trim() === 'Depends') {
                /*
                Remove version numbers from depends field, trim whitespace,
                and generate an Array of dependencies. Single Dependencies are stored as an Array because some 
                packages have multiple alternative dependencies, if that is the case the Array vontains multiple 
                packge names.
                Key is now a key in currentPackage dictionary.
                */
                const arrayOfPackages =  keyValuePair[1].replace(/\s?\([^()]*\)\s?/g, '').split(/\s?,\s?/);
                //Separate packages divided by the "|"" character
                currentPackage['Depends'] = arrayOfPackages.map(dependency => dependency.split(/\s?\|\s?/));
            } 
            else {    
                //Make key a key in currentPackage dictionary, and value the value.
                currentPackage[keyValuePair[0].trim()] = keyValuePair[1].trim();
            }              
        }
    
    
    
        // Add parsed package to all Packages as an istance of our Package model, and select wnated fields.
        allPackages[currentPackage.Package] = new Package({
            package: currentPackage.Package,
            depends: currentPackage.Depends,
            description: currentPackage.Description,
            installed_size: parseInt(currentPackage['Installed-Size']),
            section: currentPackage.Section,
            reverseDeps: []
        });
    
        //Parsing done for current package. Reset currentPackage variable
        currentPackage ={};
    }
    
    return allPackages;
}

async function getReverseDependencies(packages){

    const keys = Object.keys(packages);
    //Loop over packages.
    for(let i in keys) {
        //Loop over dependencies Array.
        for(let j in packages[keys[i]].depends) {
            //Check if package has dependencies
            if(packages[packages[keys[i]].depends[j]]) {
            //Mark parent as reverse dependency of child
            packages[packages[keys[i]].depends[j][0]].reverseDeps.push(packages[keys[i]].package);
            }
    
        }

    }
    //return all Package Objects
    return Object.values(packages);
}


module.exports = debianFileParser;
        