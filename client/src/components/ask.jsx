import css from "../styles/myStyle2.module.css"
import React from "react"

function Ask({onDelete,sentence,onClose}){
return(
    <>
        <div className={css.confirm}>
            <div className={css.boxClose}>
                <button className={css.closeConf} onClick={onClose}></button>
            </div>
            <p>{sentence}</p>
            <button className={css.btnConf} onClick={onDelete}>Delete</button>
        </div>
    </>
)
}
export default Ask