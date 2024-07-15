import { ProjectStatus } from "./enum"


//* PROJECTS
export const project1:Project = {
    id: "1",
    name: 'Projects',
    short_description: 'Donec et nisl id sapien blandit mattis. Aenean dictum odio sit amet risus. Morbi purus. Nulla a est sit amet purus venenatis iaculis. Vivamus viverra purus vel magna. Donec in justo sed odio malesuada dapibus. Nunc ultrices aliquam nunc. Vivamus facilisis pellentesque velit. Nulla nunc velit, vulputate dapibus, vulputate id, mattis ac, justo. Nam mattis elit dapibus purus. Quisque enim risus, congue non, elementum ut, mattis quis, sem. Quisque elit.',
    pictureURL: '/images/don.png',
    amount_goal: 1000,
    amount_raised: 500,
    end_time: 1630000000,
    status: ProjectStatus.ongoing,
    contribution_counter: 10,
    rewards: [
        {
            id: "1",
            name: 'reward1',
            description: 'reward1',
            required_amount: 100
        },
        {
            id: "2",
            name: 'reward2',
            description: 'reward2',
            required_amount: 200
        }
    ]
}

export const project2:Project = {
    id: "1",
    name: 'Projects',
    short_description: 'Donec et nisl id sapien blandit mattis. Aenean dictum odio sit amet risus. Morbi purus. Nulla a est sit amet purus venenatis iaculis. Vivamus viverra purus vel magna. Donec in justo sed odio malesuada dapibus. Nunc ultrices aliquam nunc. Vivamus facilisis pellentesque velit. Nulla nunc velit, vulputate dapibus, vulputate id, mattis ac, justo. Nam mattis elit dapibus purus. Quisque enim risus, congue non, elementum ut, mattis quis, sem. Quisque elit.',
    pictureURL: '/images/fusee.jpg',
    amount_goal: 1000,
    amount_raised: 500,
    end_time: 1630000000,
    status: ProjectStatus.ongoing,
    contribution_counter: 10,
    rewards: [
        {
            id: "1",
            name: 'reward1',
            description: 'reward1',
            required_amount: 100
        },
        {
            id: "2",
            name: 'reward2',
            description: 'reward2',
            required_amount: 200
        }
    ]
}

export const project3:Project = {
    id: "1",
    name: 'Projects',
    short_description: 'Donec et nisl id sapien blandit mattis. Aenean dictum odio sit amet risus. Morbi purus. Nulla a est sit amet purus venenatis iaculis. Vivamus viverra purus vel magna. Donec in justo sed odio malesuada dapibus. Nunc ultrices aliquam nunc. Vivamus facilisis pellentesque velit. Nulla nunc velit, vulputate dapibus, vulputate id, mattis ac, justo. Nam mattis elit dapibus purus. Quisque enim risus, congue non, elementum ut, mattis quis, sem. Quisque elit.',
    pictureURL: '/images/guitare.jpg',
    amount_goal: 1000,
    amount_raised: 500,
    end_time: 1630000000,
    status: ProjectStatus.ongoing,
    contribution_counter: 10,
    rewards: [
        {
            id: "1",
            name: 'reward1',
            description: 'reward1',
            required_amount: 100
        },
        {
            id: "2",
            name: 'reward2',
            description: 'reward2',
            required_amount: 200
        }
    ]
}

export const projects:Project[] = [project1, project2, project3]