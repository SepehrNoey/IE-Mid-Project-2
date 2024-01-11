// the function to be called when submit button is clicked
// it fetches the response for the given name from some api, if the given name is valid
// and also shows errors if happened
function submitClicked(event) {
    event.preventDefault()
    hideMessage()
    let name = document.getElementById("nameInput").value
    let errColor = getComputedStyle(document.body).getPropertyValue('--err-color')
    if(!validateName(name)){
        if (name.length < 1 || name.length > 255){
            showMessage("Error: invalid name length", errColor)
            return
        }else{
            showMessage("Error: invalid name pattern", errColor)
            return
        }
    }
    
    name = name.toLowerCase()
    fetch(`https://api.genderize.io/?name=${name}`)
        .then(response => {
            if (!response.ok){
                showMessage("Error: Network response was not ok", errColor)
                return
            }
            return response.json()
        })
        .then(data => {
            if (data.gender === null) {
                showMessage("Error: Can't predict this name.", errColor)
                return
            }else{
                let genderStr = firstUpper(data.gender)
                document.getElementById("predString").innerHTML = genderStr
                document.getElementById("predValue").innerHTML = data.probability
                
            }
        });
    
    showSavedAnswer(name)
    

}

// the function to be called when the save button is clicked
// it simply checks that which radio button is selected and saves the given name in nameInput 
// input element in local storage. If successful or not, shows a message 
function saveClicked(event){
    event.preventDefault()
    let gender = document.querySelector('input[name = "maleFemaleBtn"]:checked')
    let name = document.getElementById("nameInput").value.toLowerCase()
    let errColor = getComputedStyle(document.body).getPropertyValue('--err-color')
    if (name === ""){
        showMessage("Error: No name entered to save", errColor)
        return
    }else if (gender === null){
        showMessage("Error: No selected gender to save", errColor)
        return
    }

    if(localStorage.getItem(name) !== null){
        localStorage.removeItem(name)
    }
    gender = gender.value
    gender = firstUpper(gender)
    localStorage.setItem(name, gender)
    showMessage("Saved successfully.", getComputedStyle(document.body).getPropertyValue('--success-color'))
    
}

// the function to be called when the clear button is clicked
// it simply removes the key-value pair of the given name from local storage
// and if successful or not, shows a message
function clearClicked(){
    let key = document.getElementById("nameInput").value.toLowerCase()
    if (key === "" || localStorage.getItem(key) === null){
        showMessage("Error: Name doesn't exist.", getComputedStyle(document.body).getPropertyValue('--err-color'))
        return
    }

    localStorage.removeItem(key)
    showMessage("Saved answer deleted.", getComputedStyle(document.body).getPropertyValue('--clear-color'))
    
}

// it simply reveals the message container with the given message as input on the screen
function showMessage(msg, color){
    let el = document.getElementById("message")
    el.style.visibility = 'visible'
    el.style.color = color
    el.innerText = msg
}

// it simply hides the message container
function hideMessage(){
    document.getElementById("message").style.visibility = 'hidden'
}

// it simply hides the saved answer box
function hideSavedAnswerBox(){
    document.getElementById("savedAnswerBox").style.visibility = 'hidden'
}

// it simply shows the saved answer box if the given key exists in local storage
function showSavedAnswer(key){
    let value = localStorage.getItem(key)
    if (value !== null){
        document.getElementById("savedGenderSpan").innerText = value
        document.getElementById("savedAnswerBox").style.visibility = 'visible'


    }else{
        hideSavedAnswerBox()
    }

}

// it gets a string, and makes the first letter uppercase and the rest lower case
function firstUpper(str){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// uses regex to validate pattern
// the valid pattern is: capital/small english letters and space, and also
// the length of given string must be between 1 to 255
function validateName(str){
    let pattern = /^[a-zA-Z\s]{1,255}$/;
    return pattern.test(str)
}

// initial configurations
// hides message and saved answer box, and registers functions to be called for buttons
hideMessage()
hideSavedAnswerBox()
document.getElementById("submitBtn").onclick = submitClicked
document.getElementById("saveBtn").onclick = saveClicked
document.getElementById("clearBtn").onclick = clearClicked