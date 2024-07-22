'use client'

import { useState } from "react";
import { RewardsFilter, RewardsList } from "./rewardsmarket-ui";

export function RewardMarketFeature() {
    const [levelSelected, setLevelSelected] = useState<"1" | "2"| "3" | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>("");

    return (
        <div className='w-full mx-auto flex flex-col items-center justify-start gap-4'>
            <div className='w-full mx-auto flex flex-col items-center justify-start gap-4'>
                <h2 className='text-xl font-bold mb-6'>Les contributions disponibles sur le marché</h2>
                <p className="text-textColor-second dark:text-textColor-second-dark text-center w-full md:w-2/3">Solstarter permet aux contributeurs initiaux de revendre leurs contributions et les avantages qui y sont associées. Un projet vous attire et vous avez raté le lancement initial ? Rachetez une contribution ici !</p>
                <RewardsFilter level={levelSelected} setLevel={setLevelSelected} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                <RewardsList level={levelSelected} searchTerm={searchTerm}/>    
            </div>
        </div>
    )
}