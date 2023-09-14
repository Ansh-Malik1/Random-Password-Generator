//Extracting all the elements required//

const inputSlider=document.querySelector(".slider")
const passLength=document.querySelector("[passLength]")
const displayScreen=document.querySelector("[passwordDisplay]")
const copy=document.querySelector("[copyMsg]")
const strength=document.querySelector("[strengthColor]")
const generateButton=document.querySelector(".generate")
const upper=document.querySelector("#upperCase")
const lower=document.querySelector("#lowerCase")
const numbers=document.querySelector("#numbers")
const symbols=document.querySelector("#symbols")
const checkboxAll=document.querySelectorAll("input[type=checkbox]")
const copyBtn=document.querySelector("[copyButton]")


//Declaring Variables which we might need//
let password=""
generatedPass=""
let passwordLength=10  //Setting Default Value
let checkCount=0
let symbolsList=["!","$","#","&","%",".","*","-",">","<",",","/","(",")","{","}","[","]","+","@"]


//Writing Functions//

// F1. This function will update passwordLength on UI as the slider moves//
function handleSlider(){
    inputSlider.value=passwordLength
    passLength.innerText=passwordLength
    const min=inputSlider.min
    const max=inputSlider.max
    let width=((passwordLength-min)*100/(max-min))
    inputSlider.style.background = 'linear-gradient(to right, cyan 0%, cyan ' + width + '%, #fff ' + width + '%, white 100%)'// Important code to style slider
}
handleSlider()


// F2. Function to generate random Numbers, This will be used ahead to generate other stuff//
function getRandInt(min,max){
    let random=Math.floor(Math.random()*(max-min))+min
    return random
}

// F3. Function to generate random numbers
function getRandomNumber(){
    return getRandInt(0,9)
}


// F4. Function to generate random lowerCase letters(notice how we used F2 function to generate ASCII code)
function getLowerCase(){
    return String.fromCharCode(getRandInt(97,123))
}


// F5. Function to generate Upper Case letters
function getUpperCase(){
    return String.fromCharCode(getRandInt(65,91))
}


// F6. Function to generate random Symbols
function getSymbol(){
    random=getRandInt(0,symbolsList.length)
    return symbolsList[random]
}




// F7. Function to copy Pass to keyboard
async function copyPass(){
    try{
        await navigator.clipboard.writeText(displayScreen.value)   //Used for Copying to Clipboard
        copy.innerText="Copied"
        copy.style.backgroundColor="gold"
    }
    catch(e){
        copy.innerText="Failed"
    }
    setTimeout(()=>{
        copy.innerText=""
        copy.style.background="none"
    },1000)
}


// F8, Changing color of strength according to Password
function strengthCalc(){
    let hasUpper=false
    let hasLower=false
    let hasSymbols=false
    let hasNum=false

    if(upper.checked){hasUpper=true}
    if(lower.checked){hasLower=true}
    if(numbers.checked){hasNum=true}
    if(symbols.checked){hasSymbols=true}

    if((hasUpper || hasLower) && (hasNum && hasSymbols) && passwordLength>=6){
        strength.style.backgroundColor="rgb(66, 192, 66)"
    }

    else if(((hasUpper || hasLower) || (hasNum || hasSymbols)) && passwordLength>=6){
        strength.style.backgroundColor="Yellow"
    }
    else{
        strength.style.backgroundColor="rgb(222, 64, 64)"
    }
}

//Adding event Listeners

inputSlider.addEventListener("input",(e)=>{
    passwordLength=e.target.value;
    handleSlider()
    if(passwordLength<checkCount){
        passwordLength=checkCount
        handleSlider()
    }

})

copyBtn.addEventListener("click",()=>{
    if(displayScreen.value){
        copyPass()
    }
})

// Adding Event Listener to all the CheckBoxes
checkboxAll.forEach(element => {
    element.addEventListener('input',()=>{
        if(element.checked){
            checkCount++
        }
        else{
            checkCount--
        }
        if(passwordLength<checkCount){
            passwordLength=checkCount         //Handling Special Case when checkboxes are more and password Length is less
            handleSlider()
        }
    })    
});

function reset(){
    upper.checked=false
    lower.checked=false
    numbers.checked=false
    symbols.checked=false
    displayScreen.value=""
}
reset()
generateButton.addEventListener('click',()=>{
    if(checkCount>0){
        let temp=passwordLength
        let arr2=[]
        generatedPass=""
        password=""
        let arr=[]
        if(upper.checked){
            password=password+getUpperCase()
            temp--
            arr.push(getUpperCase)
        }
        if(lower.checked){
            password=password+getLowerCase()
            temp--
            arr.push(getLowerCase)
        }
        if(numbers.checked){
            password=password+getRandomNumber()
            temp--
            arr.push(getRandomNumber)
        }
        if(symbols.checked){
            password=password+getSymbol()
            temp--
            arr.push(getSymbol)
        }

        // Basic condition of all required characters is fulfilled by above code now we will add other characters randomly
        while(temp>0){
            random=getRandInt(0,arr.length)
            password=password+(arr[random]())
            temp--
        }

        // PassWord generated will be of fixed order(first 4 characters in same order always)
        //Therefore will now shuffle the generated password

        arr2=password.split('')
        while(arr2.length>0){
            randNum=getRandInt(0,arr2.length)
            generatedPass=generatedPass+arr2[randNum]
            arr2.splice(randNum,1)
        }
        
        displayScreen.value=generatedPass
        strengthCalc()
    }
})



