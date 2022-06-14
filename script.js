
/* Author: Thomas Neil 880899727 07/06/2022 */

/* DECLARATIONS */

//storing relevant HTML references for later use
const openButton = document.getElementById('fileselect');
const loginButton = document.getElementById('loginsubmit');
const registerButton = document.getElementById('registersubmit');
const loginUser = document.getElementById('loginuser');
const loginPass = document.getElementById('loginpass');
const regUser = document.getElementById('reguser');
const regPass = document.getElementById('regpass');

//Used by program to prevent running of functions that require the accounts file to be loaded
let isFileLoaded = false;

//Variable to handle the accounts file
let fileHandle;

//Variable to store username and passwords array
let userPassArray;

//Arrays to store usernames and passwords seperately
let userArray = [];
let passArray = [];

//Used by script to determine whether user is logged in or not
let loggedIn = false;

/*********************************************/
/*****************OPEN FILE*******************/
/*********************************************/

//Runs function when the file select button is pressed
openButton.addEventListener("click", function(){ openFile(); } );


async function openFile(){
    //Select the accounts file from computer storage
    fileHandle = (await window.showOpenFilePicker())[0];
    //Open accounts file and retrieve contents (usernames/passwords)
    const file = await fileHandle.getFile();
    //get contents from file
    let fileContents = await file.text();
    //console.log(fileContents);
    //split the contents of the file into array form, each element containing a username and password seperated by a space
    userPassArray = fileContents.split("\n");
    //Below code is for testing purposes, must be commented out when application is in use
    // console.log(userPassArray);
    //Splits each element of the combined array into matched username and password arrays (for login system) by seperating them using whitespace
    for(i = 0; i < userPassArray.length; i++){
        let tempArray = userPassArray[i].split(" ");
        // console.log(tempArray);
        userArray.push(tempArray[0]);
        passArray.push( tempArray[1]);
    }
    // console.log(userArray);
    // console.log(passArray);
    //lets rest of script know a file has been loaded
    alert("Accounts file was succesfully loaded");
    isFileLoaded = true;
}

/**************************************/
/****************NAVIGATION************/
/**************************************/

//The following three functions "navigate" through the app by unhiding the div for the section being navigated to and hiding all the other page divs

function navWelcome(){
    document.getElementById('welcome').hidden = false;
    document.getElementById('login').hidden = true;
    document.getElementById('register').hidden = true;
}

function navLogin(){
    document.getElementById('welcome').hidden = true;
    document.getElementById('login').hidden = false;
    document.getElementById('register').hidden = true;
}

function navRegister(){
    document.getElementById('welcome').hidden = true;
    document.getElementById('login').hidden = true;
    document.getElementById('register').hidden = false;
}

function navExit(){
    window.location.replace("https://google.com.au");
}

//The following function listens for a keypress within the window, then hides/unhides the relevant divs if the correct key is pressed using the above navigation functions
//jQuery is used to prevent navigation when the user is entering text in a text box

$(document).on("keypress", function (e) {
    if (e.key == 'a' || e.key == 'A'){
        var $focused = $(':focus');
        if ($focused.attr('type') != 'text' && $focused.attr('type') != 'password'){
            navWelcome();
        }
    } else if (e.key == 'b' || e.key == 'B'){
        var $focused = $(':focus');
        if ($focused.attr('type') != 'text' && $focused.attr('type') != 'password'){
            navLogin();
        }
    } else if (e.key == 'c' || e.key == 'C'){
        var $focused = $(':focus');
        if ($focused.attr('type') != 'text' && $focused.attr('type') != 'password'){
            navRegister();
        }
    } else if (e.key == 'e' || e.key == 'E'){
        var $focused = $(':focus');
        if ($focused.attr('type') != 'text' && $focused.attr('type') != 'password'){
            navExit();
        }
    }
});


/**************************************/
/**************REGISTRATION************/
/**************************************/

//Prevents submission of form when registering, saves new details to the chosen document if the username and password pass validation
registerButton.addEventListener("click", function(event){ 
                                                        event.preventDefault();
                                                        if(isFileLoaded){
                                                            if(validateInputs()){
                                                                saveFile();
                                                                storeUserPass();
                                                                alert("You registered succesfully!");
                                                            }
                                                        } else {
                                                            alert("You must choose an accounts file first!")
                                                        }
                                                        } );

//When the user pushes the Reveal/Hide Password button, this swaps between plain text and hidden characters in the password dialogue box                                                       
function togglePasswordVisibility(){
    if(regPass.type === "password"){
        regPass.type = "text";
    } else {
        regPass.type = "password";
    }
}


//Following 3 functions used in password generator function to provide a single random character from their type
function randomLetter(){
    var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    var char = str.charAt(Math.floor(Math.random() * str.length + 1));
    return char;
}

function randomNumber(){
    var str = '1234567890';
    var char = str.charAt(Math.floor(Math.random() * str.length + 1));
    return char;
}

function randomSymbol(){
    var str = '!@#$%^&*()?';
    var char = str.charAt(Math.floor(Math.random() * str.length + 1));
    return char;
}

function generatePassword(){

    //variable used to build password
    let pass = "";

    //establishing variables for each checkbox
    const genLetters = document.getElementById("genLetters").checked;
    const genNumbers = document.getElementById("genNumbers").checked;
    const genSymbols = document.getElementById("genSymbols").checked;

    //establish variable for password length selected by user
    const length = document.getElementById("genLength").value;

    //check that at least one checkbox is checked before generating a password
    if(!genLetters && !genNumbers && !genSymbols){
        alert("You must choose at least one component before generating a password!");
    } else {
        //This builds the password based on which components were selected
        for( i=0; i < 30; ){
            if(genLetters){
                pass += randomLetter();
                i++;
            }
            if(genNumbers){
                pass += randomNumber();
                i++
            }
            if(genSymbols){
                pass += randomSymbol();
                i++
            }
        }

        //Cuts the password down to the size determines by the user then passes the resulting password to the registration password field
        regPass.value = pass.slice(0, length);
    }

}

//Validates username and password inputs returns True or False depending on results, used to allow/prevent registration
const validateInputs = () => {

    //Function returns this value at the end, if it finds a problem it will change it to false and prevent registration
    let valid = true;

    const usernameValue = regUser.value.trim();
    const passwordValue = regPass.value.trim();
    const regexSpecialChars = /([\W])+/g;
    const regexWhiteSpaces = /([\s])+/g;
    const regexNumbers = /([\d])+/g;

    let hasWhitespace = regexWhiteSpaces.test(usernameValue);

    //Tests username against requirements
    if(usernameValue === '') {
        valid = false;
        alert("You must enter a username");
    } else if(usernameValue.length < 2 ){
        valid = false;
        alert("Username must be longer than 1 character");
    } else if(hasWhitespace){
        valid = false;
        alert("Username must not contain spaces");
    }

    //Determines what characters are present for password testing
    let hasSpecialCharacter = regexSpecialChars.test(passwordValue);
    hasWhitespace = regexWhiteSpaces.test(passwordValue);
    let hasNumbers = regexNumbers.test(passwordValue);

    //Tests password against requirements
    if(passwordValue === '') {
        valid = false;
        alert("You must enter a password");
    } else if(passwordValue.length < 2 ){
        valid = false;
        alert("Password must be longer than 1 character");
    } else if(hasWhitespace) {
        valid = false;
        alert("Password cannot contain any spaces");
    } else if(!hasSpecialCharacter){
        if(!hasNumbers){
            console.log(hasNumbers);
            valid = false;
            alert("Password must contain at least one number or symbol");
        }
    }

    return valid;
}

async function saveFile(){
    //get value from registration form inputs and add to array in required format
    userPassArray.push( regUser.value + " " + regPass.value );
    //convert array into string with each entry on a new line
    let newFileContents = userPassArray.join('\n');
    //Below code is for testing and must be commented out in final application
    console.log(newFileContents);
    //Overwrite file with new username and password array (now in string form!)
    const fileWriter = await fileHandle.createWritable();
    await fileWriter.write(newFileContents);
    await fileWriter.close();
    //Log to ensure that file was saved and to refer to when testing
    console.log(`File saved as ${fileHandle.name}`);
}

//Adds newly registered username and password to user and pass arrays used by login system to ensure login is possible after registration
function storeUserPass(){
    userArray.push(regUser.value);
    passArray.push(regPass.value);
}

/**************************************/
/*****************LOGIN****************/
/**************************************/

//validates the login when the submit button is selected
loginButton.addEventListener("click", function(event){ 
                                                    event.preventDefault();
                                                    if(!isFileLoaded){
                                                        alert("You must choose an accounts file first!");
                                                    } else {
                                                        for(i=0; i < userArray.length; i++){
                                                            if(loginUser.value == userArray[i]){
                                                                if(loginPass.value == passArray[i]){
                                                                    loggedIn = true;
                                                                    document.getElementById("loginaccess").hidden = false;
                                                                    document.getElementById("loginmessage").innerHTML = "You are logged in as: " + userArray[i];
                                                                    alert("You've logged in!");
                                                                }
                                                            }
                                                        }
                                                        if(!loggedIn){
                                                            alert("Username/Password combination not found in system");
                                                        }
                                                    }
} );

//Shows list of usernames and passwords on page when the Show Accounts button is pressed
function showAccounts(){
    document.getElementById("accountstitle").hidden = false;
    let accountsString = userPassArray.join("<br>");
    document.getElementById("accountslist").innerHTML = accountsString;
}
