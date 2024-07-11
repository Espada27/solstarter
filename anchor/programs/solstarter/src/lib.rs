use anchor_lang::prelude::*;

declare_id!("317Dj6jrujtyHMjqvQBCsVNb79kKDjQwD8dqn6TymHHC");

#[program]
pub mod solstarter {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
