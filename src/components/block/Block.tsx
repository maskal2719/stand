import React from 'react';
import style from './Block.module.css'
import {RootType} from "../../api/api";

export type BlockPropsType = {
    block: RootType
    goTo: (block: RootType) => void
}

const Block: React.FC<BlockPropsType> = React.memo(({block, goTo}) => {

    const goToFolder = () => {
        goTo(block)
    }

    return (
        <div onClick={goToFolder}
             className={style.block}
             key={block.id}>{block.name.replace(/\.[^.]+$/, "").slice(0, 90)}
        </div>
    );
});
export default React.memo(Block);
