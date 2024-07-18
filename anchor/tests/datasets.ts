import { User, Project, Reward, ProjectStatus } from "./types";

export const userData1: User = {
    name: "John Doe",
    bio: "Software Developer",
    avatar_url: "https://example.com/avatar.jpg",
    created_project_counter: 0
  };

export const userData2: User = {
    name: "Tim Cook",
    bio: "ex CEO of Apple",
    avatar_url: "https://example.com/avatar.jpg",
    created_project_counter: 0
};

/* Defining Rewards */
const reward1:Reward = {
    name: 'reward1',
    description: 'reward1',
    required_amount: 100
};
const reward2:Reward = {
    name: 'reward2',
    description: 'reward2',
    required_amount: 200
};
const reward3:Reward = {
    name: 'reward3',
    description: 'reward3',
    required_amount: 300
};

/*
    Some projects datasets

*/
export const projectData1:Project = {
    name: 'Don association',
    project_description: 'Donec et nisl id sapien blandit mattis. Aenean dictum odio sit amet risus. Morbi purus. Nulla a est sit amet purus venenatis iaculis. Vivamus viverra purus vel magna. Donec in justo sed odio malesuada dapibus. Nunc ultrices aliquam nunc. Vivamus facilisis pellentesque velit. Nulla nunc ',
    image_url: '/images/don.png',
    goal_amount: 1000,
    created_time: new Date().getTime(),
    end_time: new Date('2024-07-31T00:00:00Z').getTime(),
    rewards: [reward1, reward2, reward3],
}

export const projectData2:Project = {
    name: 'Envoyer une fusée dans l\'espace',
    project_description: 'Donec et nisl id sapien blandit mattis. Aenean dictum odio sit amet ',
    image_url: '/images/fusee.jpg',
    goal_amount: 1000,
    created_time: new Date('2024-05-01T00:00:00Z').getTime(),
    end_time: new Date('2024-08-31T00:00:00Z').getTime(),
    rewards: [reward1, reward2, reward3],
}

export const projectData3:Project = {
    name: 'Construction d\'une guitare',
    project_description: 'Donec et nisl.',
    image_url: '/images/guitare.jpg',
    goal_amount: 100,
    raised_amount: 50,
    status: ProjectStatus.Abandoned, 
    created_time: new Date('2024-01-01T00:00:00Z').getTime(),
    end_time: new Date('2024-06-31T00:00:00Z').getTime(),
    rewards: [reward1, reward2, reward3],
}