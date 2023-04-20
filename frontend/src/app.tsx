import './App.css'
import logo from "./assets/images/logo-universal.png"
import {CallCreator} from "../wailsjs/go/main/App";
import {h} from 'preact';

export function App(props: any) {
    function create() {
      console.log("Hello World")
      CallCreator("Hello World", "Hello World", "Hello World", "Hello");
    }

    return (
        <>
          <img src={logo} id="logo" alt="logo"/>
          <button className="btn" onClick={create}>Greet</button>
        </>
    )
}
