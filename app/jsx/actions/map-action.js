import {dispatch} from "../dispatcher";
import fetch from "isomorphic-fetch";
import Const from "../constants";

export default {
  fetchAll(){
    return fetch(`${Const.baseUrl}/maps`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      }
    }).then((res)=> res.json()).then((maps)=>{
      dispatch({type: "MAP_FETCH_ALL", maps});
      return maps;
    }).catch((err)=>{
      dispatch({type: "ERROR", err});
    });
  },
  save(map){
    return fetch(`${Const.baseUrl}/maps`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(map)
    }).then((res)=> res.json()).then((map)=>{
      dispatch({type: "MAP_CREATE", map});
      return map;
    }).catch((err)=>{
      dispatch({type: "ERROR", err});
    });
  }
};
