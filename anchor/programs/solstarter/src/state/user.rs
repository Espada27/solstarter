use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct User {
    pub wallet_pubkey: Pubkey,

    #[max_len(64)]
    pub name: String,

    #[max_len(128)]
    pub avatar_url: String,

    #[max_len(256)]
    pub bio: String,

    pub created_project_counter: u16,
}

impl User {}
