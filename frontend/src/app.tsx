import {CallCreator, SelectOriginalPE, SetSavePath} from "../wailsjs/go/main/App";
import {h} from 'preact';
import {useEffect, useState} from "preact/hooks";
import {JSXInternal} from "preact/src/jsx";


// Return codes from Creator.exe
enum ReturnValues {
  INIT                         = 1,
	SUCCESS                      = 0,
	ERROR_ORIGINAL_PE_NOT_FOUND  = -1,
	ERROR_STUB_NOT_FOUND         = -2,
	ERROR_EXE_TO_DLL             = -3,
	ERROR_REGISTER_PROJECT       = -4
}


export const App = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showMessage, setShowMessage] = useState<boolean>(false)

  const [responseCreator, setResponseCreator] = useState<ReturnValues>(ReturnValues.INIT)
  const [responseColor, setResponseColor] = useState<string>("")
  const [displayReturnMessage, setDisplayReturnMessage] = useState<string>("Welcome!")

  const [originalPERoute, setOriginalPERoute] = useState<string>("Not selected")
  const [outputPERoute, setOutputPERoute] = useState<string>("Not selected")
  const [key, setKey] = useState<string>("")

  const handleUploadOriginalPE = async () => {
    let response = await SelectOriginalPE()
    response = response.replaceAll("\\", "\\\\")

    setOriginalPERoute(response as string)
  }

  const handleSetSavePath = async () => {
    let response = await SetSavePath()
    response = response.replaceAll("\\", "\\\\")

    
    const extension = response.split('.').pop()
    if (extension !== "exe") {
      response += ".exe"
    }
    console.log(response)

    setOutputPERoute(response as string)
  }

  const handleChangeAPIKey = (event: JSXInternal.TargetedEvent<HTMLInputElement>) => {
    setKey(event.currentTarget.value)
  }

  const create = async () => {
    setShowMessage(false)
    setIsLoading(true)
    console.log(originalPERoute, outputPERoute, key)
    const response = await CallCreator(
      originalPERoute, 
      outputPERoute, 
      key
    );
    setResponseCreator(response as ReturnValues)
    setTimeout(() => {
      setIsLoading(false)
      setShowMessage(true)

      setTimeout(() => {
        setShowMessage(false)
      }, 60000)
    }, 250)
  }

  const handleReturnValue = (value: ReturnValues) => {
    switch (value) {
      case ReturnValues.INIT: {
        setResponseColor("")
        setResponseColor("")
        setDisplayReturnMessage("")
        break;
      }
      case ReturnValues.SUCCESS: {
        setResponseColor("#00FF00")
        setDisplayReturnMessage("Success!")
        break;
      }
      case ReturnValues.ERROR_ORIGINAL_PE_NOT_FOUND: {
        setResponseColor("#ff8000")
        setDisplayReturnMessage("[Error] Original PE not found")
        break;
      }
      case ReturnValues.ERROR_STUB_NOT_FOUND: {
        setResponseColor("#ff8000")
        setDisplayReturnMessage("[Error] Stub not found")
        break;
      }
      case ReturnValues.ERROR_EXE_TO_DLL: {
        setResponseColor("#FF0000")
        setDisplayReturnMessage("[Error] Exe not compatible, error converting to DLL")
        break;
      }
      case ReturnValues.ERROR_REGISTER_PROJECT: {
        setResponseColor("#ff8000")
        setDisplayReturnMessage("[Error] Registering project, API key invalid or server down")
        break;
      }
      default: {
        setResponseColor("#FF0000")
        setDisplayReturnMessage("[Error] Unexpected error")
        break;
      }
    }
  }

  useEffect(() => {
    handleReturnValue(responseCreator)
  }, [responseCreator])

  return (
    <body>
      <main class={'container'}>
        <div>
          <label><b>Archivo original:</b> {originalPERoute}</label>
          <button onClick={handleUploadOriginalPE}>Seleccionar archivo input (.exe)</button>
        </div>

        <div>
          <label><b>Ruta output:</b> {outputPERoute}</label>
          <button onClick={handleSetSavePath}>Seleccionar archivo output</button>
        </div>

        <div>
          <label><b>API KEY:</b></label>
          <input type="text" onChange={handleChangeAPIKey} value={key} placeholder={'Key de la API'} />
        </div>

        <button className={"btn" && isLoading ? "secondary" : "" } onClick={create} aria-busy={isLoading}>Protect</button>

        {
          showMessage && (
            <div class={'loading'}>
              <text style={{ color: responseColor }}>
                {displayReturnMessage}
              </text>
            </div>
          )
        }

      </main>
    </body>
  )
}
