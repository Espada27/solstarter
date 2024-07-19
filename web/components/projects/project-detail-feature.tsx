'use client'
import { useEffect, useState } from "react";
import { useSolstarterProgram } from "../solstarter/solstarter-data-access";
import LoaderSmall from "../displayElements/LoaderSmall";
import { StandardErrorDisplay } from "../ui/ui-layout";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";
import Image from "next/image";
import MainButtonLabel from "../button/MainButtonLabel";


type ProjectDetailFeatureProps = {
    projectAccountPubkey: string;
}

export function ProjectDetailFeature(props: ProjectDetailFeatureProps){
    const {projectsAccounts} = useSolstarterProgram();
    const router = useRouter();

    const [projectToDisplay, setProjectToDisplay] = useState<Project | null>(null);

    useEffect(() => { 
        // get the project data from the program accounts
        if (projectsAccounts.data){
            const projectData = projectsAccounts.data.find(
                (account) => account.publicKey.toBase58() === props.projectAccountPubkey
            );
            if(projectData) setProjectToDisplay(projectData.account as Project);
        }
     },[props.projectAccountPubkey]);

    if (projectsAccounts.isPending) return <LoaderSmall/>;

    if(!projectToDisplay) return <StandardErrorDisplay/>;

    console.log("projectToDisplay",projectToDisplay);
    

    return (
        <div className='w-full mx-auto flex flex-col items-start justify-start gap-4'>
            <div className="flex justify-start w-full">
                <button onClick={()=>router.back()} className="flex justify-start items-center text-textColor-second dark:text-textColor-second-dark">
                    <IoArrowBack/><p>retour</p>
                </button>
            </div>
            {/* title */}
            <h2 className='text-xl font-bold mx-auto'>{projectToDisplay?.name}</h2>
            {/* image and contribution */}
            <div className="flex justify-start items-start gap-8 w-full">
                <div className="relative w-1/3 aspect-square">
                    <Image src={projectToDisplay.imageUrl} alt='project image' fill  className=' object-cover ' />
                </div>
                <div className="flex flex-col items-start justify-between w-full gap-4">
                    <p>Montant des contributions</p>
                    <p>{projectToDisplay.raisedAmount.toString()} SOL sur {projectToDisplay.goalAmount.toString()} SOL </p>
                    <button className="w-1/2"><MainButtonLabel label="Contribuer au projet"/></button>
                </div>
            </div>
            {/* about */}
            <h3 className="font-bold mt-10">A propos du projet</h3>
            <p className="text-textColor-second dark:text-textColor-second-dark">{projectToDisplay.projectDescription}</p>
            {/* reward levels */}


        </div>
    )
}