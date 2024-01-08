// Define global variables

var tableNumber = 0
var row = 0
var targetHeight = 594
var responsibilityNumber = 0



// Define functions

function makeTable(headerList, bodyArray, responsibleParties){

    // This function takes the large spreadsheet of betterment data and breaks it up into discrete tables.
    // Tables will break for two reasons:
    //    1) The height of the table exceeds the target height (i.e it's going to fall off the powerpoint slide)
    //    2) The current row belongs to a new responsible group (i.e. architect, owner, etc.)
    // In order to create a new table, this function calls itself when it sees a signal to break.

    if (row < bodyArray.length-1){

        // add container
        let tableContainer = document.createElement('div')
        tableContainer.setAttribute('class', 'table-container')
        tableContainer.setAttribute('id', `table-container-${tableNumber}`)
        document.querySelector('body').appendChild(tableContainer)
        
        // add Prime Responsible Party Table Title
        let primeResponsible = document.createElement('div')
        primeResponsible.setAttribute('class', 'prime-responsible')
        primeResponsible.setAttribute('id', `prime-responsible-${tableNumber}`)
        primeResponsible.innerText = responsibleParties[responsibilityNumber]
        document.getElementById(`table-container-${tableNumber}`).appendChild(primeResponsible)

        // add table
        let table = document.createElement('table')
        table.setAttribute('id', `table-${tableNumber}`)
        document.getElementById(`table-container-${tableNumber}`).appendChild(table)
        tableNumber++

        // add header row to table
        {
            let thead = document.createElement('thead')
            thead.setAttribute('id', `thead-${tableNumber-1}`)
            document.getElementById(`table-${tableNumber-1}`).appendChild(thead)
            let tr = document.createElement('tr')
            tr.setAttribute('id', `thead-tr-${tableNumber-1}`)
            document.getElementById(`thead-${tableNumber-1}`).appendChild(tr)
            for (header in headerList){
                if (headerList[header] == "Prime Responsible Party"){
                    // This excludes the "Prime Responsible Party" header
                    continue
                }
                let th = document.createElement('th')
                th.innerText = headerList[header]
                document.getElementById(`thead-tr-${tableNumber-1}`).appendChild(th)
            }
        }

        // add body
        {
            let tbody = document.createElement('tbody')
            tbody.setAttribute('id', `tbody-${tableNumber-1}`)
            document.getElementById(`table-${tableNumber-1}`).appendChild(tbody)
        }

        // begin adding body rows to table
        for (row; row < bodyArray.length-1; row++){
            
            // check responsible party, ensure one responsible party type per table
            if (bodyArray[row][0] != responsibleParties[responsibilityNumber]){
                responsibilityNumber++
                break
            }
            
            // add rows
            let tr = document.createElement('tr')
            tr.setAttribute('id', `table-${tableNumber-1}-row-${row}`)
            document.getElementById(`tbody-${tableNumber-1}`).appendChild(tr)
            for (col in bodyArray[row]){
                if(headerList[col] == 'Prime Responsible Party'){
                    //this excludes the "Prime Responsible Party" column
                    continue
                }
                let td = document.createElement('td')
                td.innerText = bodyArray[row][col]
                if(headerList[col] == 'Betterment'){
                    // Assumes that "Indicator area" col comes directly after "Betterment" col
                    td.setAttribute('class', `betterment-${bodyArray[row][parseInt(col)+1].replaceAll(" ", "-").replaceAll("&", "and")}`)
                }
                if(headerList[col] == 'Indicator area'){
                    // Assumes that "Indicator area" col comes directly after "Betterment" col
                    td.setAttribute('class', `indicator-${bodyArray[row][col].replaceAll(" ", "-").replaceAll("&", "and")}`)
                }
                document.getElementById(`table-${tableNumber-1}-row-${row}`).appendChild(td)
            }
            
            // check clientHeight, if bigger then break and make a new table
            if ((document.getElementById(`table-${tableNumber-1}`).clientHeight)>targetHeight) {
                document.getElementById(`table-${tableNumber-1}-row-${row}`).remove()
                break
            }
        }
        makeTable(headerList, bodyArray, responsibleParties)
    } else {
        return
}
}

function getKeys(jsonData){
    keys = Object.keys(jsonData)
    return keys
}

function arrayify(jsonData){
    
    // turn JSON data into array
    let objects = Object.values(jsonData) 
    let values = []
    for (let object of objects){
        values.push(Object.values(object))
    }
    
    // flip matrix
    let reorderedList = []
    for(let r=0; r < values[0].length; r++){
        let tempList = []
        for(let c=0; c < values.length; c++){
            tempList.push(values[c][r])
        }
        reorderedList.push(tempList)
    }

    return reorderedList
}

function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}



// Fetch and operate upon data
const betterments = fetch(`./betterment_list.json`)
  .then((response) => {
    return response.json()})

const runProgram = () => {
  betterments.then((bettermentsObject) => {
    responsibleParties = Object.values(Object.values(bettermentsObject)[0]).filter(onlyUnique)
    headerList = getKeys(bettermentsObject)
    bodyArray = arrayify(bettermentsObject)
    makeTable(headerList, bodyArray, responsibleParties)
  });
};
runProgram()