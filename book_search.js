
/** Example input object. */
const twentyLeaguesIn = [
    {
        "Title": "Twenty Thousand Leagues Under the Sea",
        "ISBN": "9780000528531",
        "Content": [
            {
                "Page": 31,
                "Line": 8,
                "Text": "now simply went on by her own momentum.  The dark-"
            },
            {
                "Page": 31,
                "Line": 9,
                "Text": "ness was then profound; and however good the Canadian\'s"
            },
            {
                "Page": 31,
                "Line": 10,
                "Text": "eyes were, I asked myself how he had managed to see, and"
            } 
        ] 
    }
]


/**
 * Searches for matches in scanned text.
 * @param {string} searchTerm - The word or term we're searching for. 
 * @param {JSON} scannedTextObj - A JSON object representing the scanned text.
 * @returns {JSON} - Search results.
 * */ 
function findSearchTermInBooks(searchTerm, scannedTextObj) {
    if (scannedTextObj.length === 0) {
        return { SearchTerm: searchTerm, Message: "No books found in the list" };
    }else if( searchTerm === ""){
        return { SearchTerm : searchTerm, Message: `Please enter a valid search term`} 
    }else if (scannedTextObj[0].Content.length === 0){
        return { SearchTerm : searchTerm, Message: `No content available for this book title`} 
    }

    let results = [];
    let lowerCaseTerm = searchTerm.toLowerCase();
    //If term is hyphenated, remove it
    let removedHypenTerm = lowerCaseTerm.split('-').join('');

    scannedTextObj.forEach(book => {
        book.Content.forEach((content, index) => {
            let lowerCaseText = content.Text.toLowerCase();
            if (lowerCaseText.includes(lowerCaseTerm) || lowerCaseText.includes(removedHypenTerm)) {
                results.push({
                    ISBN: book.ISBN,
                    Page: content.Page,
                    Line: content.Line,
                });
            } else if (index < book.Content.length - 1) {
                // Check for hyphenated words in the text
                const nextContent = book.Content[index + 1];
                if (checkForHyphen(lowerCaseTerm, content, nextContent, removedHypenTerm)) {  //nextContent-> next line
                    results.push({
                        ISBN: book.ISBN,
                        Page: content.Page,
                        Line: content.Line,
                    });
                }
            }
        });
    });

    if (results.length === 0) {
        return { SearchTerm: searchTerm, Message: "No results for term found in text" };
    } else {
        return { SearchTerm: searchTerm, Results: results };
    }
}

function checkForHyphen(searchTerm, currentContent, nextContent, removedHypenTerm) {
    const words = currentContent.Text.toLowerCase().split(' ');
    const lastWord = words[words.length - 1];

    if (lastWord.endsWith('-')) {
        const firstWordNextLine = nextContent.Text.toLowerCase().split(' ')[0];
        const combinedWord = lastWord.slice(0, -1) + firstWordNextLine;
        if (combinedWord === searchTerm) {
            return true;
        }
        if (combinedWord === removedHypenTerm) {
            return true;
        }
    }
    return false;
}


// Example usage
let searchTerm = "the";
console.log(findSearchTermInBooks(searchTerm, twentyLeaguesIn));

    
/** Example output object - Adapted to account for case insensitive search */
 const twentyLeaguesOut = {
     "SearchTerm": "the",
     "Results": [
        {
          "ISBN": "9780000528531",
            "Page": 31,
            "Line": 8
        },
        {
            "ISBN": "9780000528531",
              "Page": 31,
              "Line": 9
          }
   ]
 }

/*
 _   _ _   _ ___ _____   _____ _____ ____ _____ ____  
| | | | \ | |_ _|_   _| |_   _| ____/ ___|_   _/ ___| 
| | | |  \| || |  | |     | | |  _| \___ \ | | \___ \ 
| |_| | |\  || |  | |     | | | |___ ___) || |  ___) |
 \___/|_| \_|___| |_|     |_| |_____|____/ |_| |____/ 
                                                      
 */

/* We have provided two unit tests. They're really just `if` statements that 
 * output to the console. We've provided two tests as examples, and 
 * they should pass with a correct implementation of `findSearchTermInBooks`. 
 * 
 * Please add your unit tests below.
 * */

/** We can check that, given a known input, we get a known output. */
const test1result = findSearchTermInBooks("the", twentyLeaguesIn);
if (JSON.stringify(twentyLeaguesOut) === JSON.stringify(test1result)) {
    console.log("PASS: Test 1");
} else {
    console.log("FAIL: Test 1");
    console.log("Expected:", twentyLeaguesOut);
    console.log("Received:", test1result);
}

/** We could choose to check that we get the right number of results. */
const test2result = findSearchTermInBooks("the", twentyLeaguesIn); 
if (test2result.Results.length == 2) {
    console.log("PASS: Test 2");
} else {
    console.log("FAIL: Test 2");
    console.log("Expected:", twentyLeaguesOut.Results.length);
    console.log("Received:", test2result.Results.length);
}

/** Test for case insensitivity. */
const test3result = findSearchTermInBooks("ThE", twentyLeaguesIn); 
if (test3result.Results.length == 2) {
    console.log("PASS: Test 3 (Case Insensitivity)");
} else {
    console.log("FAIL: Test 3 (Case Insensitivity)");
    console.log("Expected 2 results for 'ThE'");
    console.log("Received:", test3result.Results.length, "results");
}


/**NEGATIVE TEST CASES */

/** Test for empty string for search term */
const test4result = findSearchTermInBooks("", twentyLeaguesIn);
if (test4result.Message === "Please enter a valid search term") {
    console.log("PASS: Test 4 (Empty String)");
} else {
    console.log("FAIL: Test 4 (Empty String)");
}

/** Test for non-existent search term */
const test5result = findSearchTermInBooks("hippo", twentyLeaguesIn);
if (test5result.Message === "No results for term found in text") {
    console.log("PASS: Test 5 (Non-existent Term)");
} else {
    console.log("FAIL: Test 5 (Non-existent Term)");
}

/** Test for Unavailable Content */
const bookWithNoContent = [
    {
        "Title": "Sample Book",
        "ISBN": "1234567890",
        "Content": [] 
    }
]

const test6result = findSearchTermInBooks("anyTerm", bookWithNoContent);
if (test6result.Message === "No content available for this book title") {
    console.log("PASS: Test 6 (No Content)");
} else {
    console.log("FAIL: Test 6 (No Content)");
}
