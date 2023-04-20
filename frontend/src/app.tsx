import {CallCreator} from "../wailsjs/go/main/App";
import {h} from 'preact';
import {useEffect, useState} from "preact/hooks";


// Return codes from Creator.exe
enum ReturnValues {
  INIT                         = 1,
	SUCCESS                      = 0,
	ERROR_ORIGINAL_PE_NOT_FOUND  = -1,
	ERROR_STUB_NOT_FOUND         = -2,
	ERROR_EXE_TO_DLL             = -3,
	ERROR_REGISTER_PROJECT       = -4,
	UNEXPECTED_ERROR             = -5
}


export const App = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showMessage, setShowMessage] = useState<boolean>(false)

  const [responseCreator, setResponseCreator] = useState<ReturnValues>(1)
  const [responseColor, setResponseColor] = useState<string>("")
  const [displayReturnMessage, setDisplayReturnMessage] = useState<string>("Welcome!")

  const [originalPERoute, setOriginalPERoute] = useState<string>("")
  const [outputPERoute, setOutputPERoute] = useState<string>("")
  const [key, setKey] = useState<string>("")

  const create = async () => {
    setShowMessage(false)
    setIsLoading(true)
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
        setResponseColor("")
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
      case ReturnValues.UNEXPECTED_ERROR: 
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
          <label>Archivo original:</label>
          <input type="file" accept={'*.exe'} onChange={e => setOriginalPERoute("")} value={originalPERoute} />
        </div>

        <div>
          <label>Ruta output:</label>
          <input type="file" onChange={e => setOutputPERoute("")} value={outputPERoute} />
        </div>

        <div class={'row'}>
          <label>API KEY:</label>
          <input type="text" onChange={e => setKey("")} value={key} placeholder={'Key de la API'} />
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
