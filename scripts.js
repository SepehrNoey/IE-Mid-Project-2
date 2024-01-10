function submitClicked(event) {
    event.preventDefault()
    hideError()
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

function clearClicked(){
    let key = document.getElementById("nameInput").value.toLowerCase()
    if (key === "" || localStorage.getItem(key) === null){
        showMessage("Error: Name doesn't exist.", getComputedStyle(document.body).getPropertyValue('--err-color'))
        return
    }

    localStorage.removeItem(key)
    showMessage("Saved answer deleted.", getComputedStyle(document.body).getPropertyValue('--clear-color'))
    
}

function showMessage(msg, color){
    let el = document.getElementById("message")
    el.style.visibility = 'visible'
    el.style.color = color
    el.innerText = msg
}

function hideError(){
    document.getElementById("message").style.visibility = 'hidden'
}

function hideSavedAnswerBox(){
    document.getElementById("savedAnswerBox").style.visibility = 'hidden'
}


function showSavedAnswer(key){
    let value = localStorage.getItem(key)
    if (value !== null){
        document.getElementById("savedGenderSpan").innerText = value
        document.getElementById("savedAnswerBox").style.visibility = 'visible'


    }else{
        hideSavedAnswerBox()
    }

}

function firstUpper(str){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function validateName(str){
    let pattern = /^[a-zA-Z\s]{1,255}$/;
    return pattern.test(str)
}


hideError()
hideSavedAnswerBox()
document.getElementById("submitBtn").onclick = submitClicked
document.getElementById("saveBtn").onclick = saveClicked
document.getElementById("clearBtn").onclick = clearClicked