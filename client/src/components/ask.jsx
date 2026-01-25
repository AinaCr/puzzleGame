import css from "../styles/myStyle2.module.css"
import React from "react"

function Ask({onDelete,sentence,onClose,btnSent}){
return(
    <>
        <div className={css.confirm}>
            <div className={css.boxClose}>
                <button className={css.closeConf} onClick={onClose}>x</button>
            </div>
            <p>{sentence}</p>
            <button className={css.btnConf} onClick={onDelete}>{btnSent}</button>
        </div>
    </>
)
}
export default Ask