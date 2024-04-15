import { useEffect, useRef, useState } from "react";
import "./App.css"
import { FaCopy } from "react-icons/fa";
import CopyToClipboard from "react-copy-to-clipboard";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
}

const generatePassword = (length, uppercaseLetters, lowercaseLetters, numbers, symbols) => {
  const lowerCharacters = "abcdefghijklmnopqrstuvwxyz";
  const upperCharacters = lowerCharacters.toUpperCase();
  const allDigits = "0123456789";
  const allowedSymbols = "!()?[]_`~:!@#$%^&*+="

  let fullCharacters = ""
  
  if(uppercaseLetters) fullCharacters += upperCharacters
  if(lowercaseLetters) fullCharacters += lowerCharacters
  if(numbers)          fullCharacters += allDigits
  if(symbols)          fullCharacters += allowedSymbols

  if(fullCharacters.length < 1)
    return {password: "", strength: -1}

  let generatedPassword = "";
  const bitsEntropy = length * Math.log2(fullCharacters.length)
  while(length > 0){
    generatedPassword += fullCharacters[getRandomInt(fullCharacters.length)]
    --length;
  }

  return {password: generatedPassword, strength: bitsEntropy}
}

const passCategory = (entropy) => {
  console.log(entropy)
  if (0 <= entropy && entropy <= 35)
      return 1
  else if (35 < entropy && entropy <= 59)
    return 2
  else if(59 < entropy && entropy <= 119)
    return 3
  else  
    return 4
}

const passLabel = [
  "Low","Medium","High","Extra"
]


const App = () => {

  const [password, setPassword] = useState({password:"",strength:0 });
  const allowLowercase = useRef(false)
  const allowUppercase = useRef(false)
  const allowSymbols = useRef(false)
  const allowNumbers = useRef(false)
  const [passLength, setPassLength] = useState(3)

  const [cat, setCat] = useState(0)
  
  
  useEffect(()=>{
    setCat(passCategory(password.strength)  )
  }, [password])

  return <div className="app">
    <main>
      <h2>Password Generator</h2>
      <div className="top">
        <p
          style={{opacity: password.password ? 1 : 0.5}}
        >{password.password ? password.password : "P4$5W0rD!"}</p>
        <div>
          <CopyToClipboard text={password.password}>
        <FaCopy id="copy" size={20} 
          onClick= {() => {
            navigator.clipboard.writeText(password.password)}
          }
          />  
          </CopyToClipboard>
        
        </div>
      </div>
      <div className="bottom">

        <div className="len"> 
          <h3>Character Length</h3>
          <p>{passLength}</p>
        </div>

        <input type="range" min="3" max="20" value={passLength} onChange={e=>{
          console.log(e.target.value)
          setPassLength(e.target.value)}}/>
        
        <div className="options">
          <div>
            <input type="checkbox" name="upperc" id="upperc" ref={allowUppercase} />
            <label htmlFor="upperc">Include Uppercase Letters</label>
          </div>

          <div>
            <input type="checkbox" name="lowerc" id="lowerc" ref={allowLowercase} />
            <label htmlFor="lowerc">Include Lowercase Letters</label>
          </div>

          <div>
            <input type="checkbox" name="numberc" id="numberc" ref={allowNumbers}/>
            <label htmlFor="numberc">Include Numbers</label>
          </div>

          <div>
            <input type="checkbox" name="symbolc" id="symbolc" ref={allowSymbols}/>
            <label htmlFor="symbolc">Include Symbols</label>
          </div>
        </div>

        <div className="strength">
          <h3 style={{fontSize:"0.8rem", opacity: 0.5}}>STRENGTH</h3>
          <div>
            <h3>{passLabel[cat - 1]}</h3>
            <div className="bar" style={{backgroundColor: cat >= 1 ? "yellow":""}}></div>
            <div className="bar" style={{backgroundColor: cat >= 2 ? "yellow":""}}></div>
            <div className="bar" style={{backgroundColor: cat >= 3 ? "yellow":""}}></div>
            <div className="bar" style={{backgroundColor: cat >= 4 ? "yellow":""}}></div>
          </div>
        </div>

        <button
          onClick={() => {
              const gen = (generatePassword(passLength,
                allowUppercase.current.checked,
                allowLowercase.current.checked,
                allowNumbers.current.checked,
                allowSymbols.current.checked

              ) );

              if(gen.strength > - 1)
                setPassword(gen)
          
          }}
        >
          GENERATE
        </button>
      </div>
    </main>
  </div>
}
export default App
