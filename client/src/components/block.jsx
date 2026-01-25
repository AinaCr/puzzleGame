import React from "react";
import leStyle from '../styles/myStyle.module.css';
import { motion } from "framer-motion";

function Block({style, className, onClick}){
    return<motion.div layout whileHover={{scale:"1.08",boxShadow:"0 0 15px darkgrey" }}  transition={{type:"spring", stiffness:300, damping:25}} style={style} className={className} onClick={onClick} ></motion.div>
}

export default Block;