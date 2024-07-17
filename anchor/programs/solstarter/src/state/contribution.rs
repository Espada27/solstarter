use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Contribution {
    pub amount: u32,

    pub user_pubkey: Pubkey,

    pub project_pubkey: Pubkey,
}

impl Contribution {}
