import React from 'react';
import style from './Block.module.css'
import {MainType} from "../../App";

export type BlockPropsType = {
    block: MainType
    goTo: (block: MainType) => void
}

const Block: React.FC<BlockPropsType> = ({block, goTo}) => {
    return (
        <div onClick={() => goTo(block)}
             className={style.block}
             key={block.id}>{block.name.replace(/\.[^.]+$/, "").slice(0, 90)}
        </div>
    );
};

export default Block;