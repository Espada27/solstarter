pub mod project {
    use anchor_lang::prelude::*;

    #[account]
    #[derive(InitSpace)]
    pub struct Project {
        pub owner_pubkey: Pubkey,

        #[max_len(64)]
        pub name: String,

        #[max_len(128)]
        pub image_url: String,

        #[max_len(3000)]
        pub project_description: String,

        pub goal_amount: u32,
        pub raised_amount: u32,
        pub end_time: u64,
        pub status: Status,
        pub contribution_counter: u16,

        #[max_len(972)] //3 rewards of 324 bytes each
        pub rewards: Vec<Reward>,
    }

    impl Project {
        pub const ACCOUNT_LEN: usize =
            32 + (4 + 64) + (4 + 128) + (4 + 3000) + 4 + 4 + 8 + 1 + 2 + (4 + 3 * (64 + 256 + 4)); // Length of the account 4231 bytes
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
    #[derive(InitSpace)]
    pub struct User {
        pub wallet_pubkey: Pubkey,

        #[max_len(64)]
        name: String,

        #[max_len(128)]
        avatar_url: String,

        #[max_len(256)]
        description: String,

        created_project_counter: u16,
    }

    impl User {
        pub const ACCOUNT_LEN: usize = 32 + 64 + 128 + 256 + 2; // Length of the account 482 bytes
    }
}

pub mod contribution {
    use anchor_lang::prelude::*;

    #[account]
    pub struct Contribution {
        pub amount: u32,

        pub user_pubkey: Pubkey,

        pub project_pubkey: Pubkey,
    }

    impl Contribution {
        pub const ACCOUNT_LEN: usize = 4 + 32 + 32; // Length of the account 68 bytes
    }
}
