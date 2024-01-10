function submitClicked(event) {
    event.preventDefault()
    hideError()
    let name = document.getElementById("nameInput").value.toLowerCase()
    let errColor = getComputedStyle(document.body).getPropertyValue('--err-color')
    fetch(`https://api.genderize.io/?name=${name}`)
        .then(response => {
            if (!response.ok){
                showMessage("Error: Network response was not ok", errColor)
                throw new Error()
            }
            return response.json()
        })
        .then(data => {
            if (data.gender === null) {
                showMessage("Error: Can't predict this name.", errColor)
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
    let key = document.getElementById("nameInput").value
    if (key === "" || localStorage.getItem(key) === null){
        showMessage("Error: Name doesn't exist.", getComputedStyle(document.body).getPropertyValue('--err-color'))
        return
    }

    localStorage.removeItem(key)
    showMessage("Saved answer deleted.", getComputedStyle(document.body).getPropertyValue('--clear-color'))
    
}

function showMessage(msg, color){
    let el = document.getElementById("message")
    el.style.display = 'block'
    el.style.color = color
    el.innerText = msg
}

function hideError(){
    document.getElementById("message").style.display = 'none'
}

function hideSavedAnswerBox(){
    document.getElementById("savedAnswerBox").style.display = 'none'
}


function showSavedAnswer(key){
    let value = localStorage.getItem(key)
    if (value !== null){
        document.getElementById("savedGenderSpan").innerText = value
        document.getElementById("savedAnswerBox").style.display = 'block'


    }else{
        hideSavedAnswerBox()
    }

}

function firstUpper(str){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


hideError()
hideSavedAnswerBox()
document.getElementById("submitBtn").onclick = submitClicked
document.getElementById("saveBtn").onclick = saveClicked
document.getElementById("clearBtn").onclick = clearClicked