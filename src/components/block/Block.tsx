import React from 'react';
import style from './Block.module.css'
import {RootType} from "../../api/api";

export type BlockPropsType = {
    block: RootType
    goTo: (block: RootType) => void
    folders: RootType[]
}

const Block: React.FC<BlockPropsType> = React.memo(({block, goTo,folders}) => {

    const goToFolder = () => {
        goTo(block)
    }

    const blockName = block.name.length > 90 ? block.name.replace(/\.[^.]+$/, "").slice(0,90) + '...' : block.name.replace(/\.[^.]+$/, "")

    return (
        <div onClick={goToFolder}
             className={folders.length < 15 ? style.block : style.blockMin}
             key={block.id}>{blockName}
        </div>
    );
});
export default React.memo(Block);
