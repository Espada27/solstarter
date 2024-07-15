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
