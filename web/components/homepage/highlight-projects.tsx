import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

type Props = {
    projects:Project[]
}

const HighlightProjects = (props: Props) => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };


    return (
        <div className='flex justify-center items-center w-full min-h-full overflow-x-auto md:overflow-x-hidden'>
            {props.projects.slice(0,3).map((project, index) => (
                <div key={index} className='p-4'>
                    <Link href={`/project/${project.pubkey}`}className='relative w-full'>
                        <Image src={project.image_url} alt='collection picture' width={400} height={400}  className='object-cover aspect-square mx-auto'/>
                        <div className='mx-auto absolute md:w-3/4 lg:w-2/3 bottom-0 lg:bottom-4 left-0 lg:left-4 flex flex-col justify-start items-start gap-2 bg-accentColor/70  text-white p-4'>
                            <h3 className='text-h3 lg:text-h2'>{project.name}</h3>
                        </div>
                    </Link>
                </div>
            ))}

        </div>
    )
}

export default HighlightProjects
