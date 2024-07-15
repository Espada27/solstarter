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
}
