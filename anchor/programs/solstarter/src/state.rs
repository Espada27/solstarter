pub mod project {
    use anchor_lang::prelude::*;

    #[account]
    #[derive(InitSpace)]
    pub struct Project {
        pub owner_pubkey: Pubkey,

        #[max_len(64)]
        pub project_name: String,

        #[max_len(128)]
        pub image_url: String,

        #[max_len(3000)]
        pub project_description: String,

        pub goal_amount: u32,
        pub raised_amount: u32,
        pub end_time: u64,
        pub status: Status,
        pub contribution_counter: u16,

        #[max_len(1056)] //3 rewards of 352 bytes each
        pub rewards: Vec<Reward>,
    }

    impl Project {
        pub const ACCOUNT_LEN: usize =
            32 + 64 + 128 + 3000 + 4 + 4 + 8 + 1 + 2 + 32 + (3 * (64 + 256 + 4)); // Length of the account 4349 bytes
    }

    #[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
    pub struct Reward {
        #[max_len(64)]
        pub name: String,

        #[max_len(256)]
        pub reward_description: String,

        pub reward_amount: u32,
    }

    #[derive(Clone, InitSpace, AnchorSerialize, AnchorDeserialize)]
    pub enum Status {
        Draft = 0,
        Ongoing = 1,
        Completed = 2,
        Abandoned = 3,
    }
}

pub mod user {
    use anchor_lang::prelude::*;

    #[account]
    pub struct User {
        //Not implemented
    }
}

pub mod contribution {
    use anchor_lang::prelude::*;

    #[account]
    pub struct Contribution {
        //Not implemented
    }
}
