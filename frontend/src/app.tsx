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
  const [responseCreator, setResponseCreator] = useState<ReturnValues>(1)
  const [displayReturnMessage, setDisplayReturnMessage] = useState<string>("Welcome!")

  const [originalPERoute, setOriginalPERoute] = useState<string>("")
  const [outputPERoute, setOutputPERoute] = useState<string>("")
  const [key, setKey] = useState<string>("")

  const create = async () => {
    const response = await CallCreator(
      originalPERoute, 
      outputPERoute, 
      key
    );
    setResponseCreator(response as ReturnValues)
  }

  const handleReturnValue = (value: ReturnValues) => {
    console.log(value)
    switch (value) {
      case ReturnValues.INIT: {
        setDisplayReturnMessage("")
        break;
      }
      case ReturnValues.SUCCESS: {
        setDisplayReturnMessage("Success!")
        break;
      }
      case ReturnValues.ERROR_ORIGINAL_PE_NOT_FOUND: {
        setDisplayReturnMessage("Error: Original PE not found")
        break;
      }
      case ReturnValues.ERROR_STUB_NOT_FOUND: {
        setDisplayReturnMessage("Error: Stub not found")
        break;
      }
      case ReturnValues.ERROR_EXE_TO_DLL: {
        setDisplayReturnMessage("Error: Converting to DLL")
        break;
      }
      case ReturnValues.ERROR_REGISTER_PROJECT: {
        setDisplayReturnMessage("Error: Registering project")
        break;
      }
      case ReturnValues.UNEXPECTED_ERROR: 
      default: {
        setDisplayReturnMessage("Error: Unexpected error")
        break;
      }
    }
  }

  useEffect(() => {
    handleReturnValue(responseCreator)
  }, [responseCreator])

  return (
    <>
      <div>
        <label>Archivo original:</label>
        <input type="file" id="original" name="original" onChange={e => setOriginalPERoute("")} value={originalPERoute} />
      </div>

      <div>
        <label>Ruta output:</label>
        <input type="file" id="original" name="original" onChange={e => setOutputPERoute("")} value={outputPERoute} />
      </div>

      <div>
        <label>API KEY:</label>
        <input type="file" id="original" name="original" onChange={e => setKey("")} value={key} />
      </div>

      <button className="btn" onClick={create}>Protect!</button>
      <text>{displayReturnMessage}</text>
    </>
  )
}
